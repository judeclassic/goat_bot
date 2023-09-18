import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress, Pool, Route, SwapOptions, SwapQuoter, SwapRouter, Trade } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'
import { ERC20_ABI, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS, QUOTER_CONTRACT_ADDRESS, SWAP_ROUTER_ADDRESS, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER } from '../../handler/trade/constants'
import { TransactionState } from '../../handler/trade/providers'
import JSBI from 'jsbi'
import { CurrentConfig } from './config'
import { fromReadableAmount } from './utils'
import { IWallet } from '../database/models/user'

export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f'  

export type TokenTrade = Trade<Token, Token, TradeType>

interface PoolInfo {
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96: any;
  liquidity: any;
  tick: number;
}

class TradeRepository {
    provider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
        if (!this.provider) throw new Error('No provider');
    }
    
    getPoolInfo = async ({ contract_address }: { contract_address: string }): Promise<PoolInfo> => {
    
        const currentPoolAddress = computePoolAddress({
            factoryAddress: contract_address,
            tokenA: CurrentConfig.tokens.in,
            tokenB: CurrentConfig.tokens.out,
            fee: CurrentConfig.tokens.poolFee,
        });
    
        const poolContract = new ethers.Contract( currentPoolAddress, IUniswapV3PoolABI.abi, this.provider );
    
        const [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.liquidity(),
            poolContract.slot0(),
        ]);
    
        return { token0, token1, fee, tickSpacing, liquidity, sqrtPriceX96: slot0[0], tick: slot0[1] };
    };

    getWalletAddress = (wallet: IWallet) => {
        return new ethers.Wallet(wallet.private_key, this.provider);
    }

    createTrade = async (): Promise<TokenTrade> => {
        const poolInfo = await this.getPoolInfo({ contract_address: POOL_FACTORY_CONTRACT_ADDRESS})
      
        const pool = new Pool(
          CurrentConfig.tokens.in,
          CurrentConfig.tokens.out,
          CurrentConfig.tokens.poolFee,
          poolInfo.sqrtPriceX96.toString(),
          poolInfo.liquidity.toString(),
          poolInfo.tick
        )
      
        const swapRoute = new Route(
          [pool],
          CurrentConfig.tokens.in,
          CurrentConfig.tokens.out
        )
      
        const amountOut = await this.getOutputQuote(swapRoute)
      
        const uncheckedTrade = Trade.createUncheckedTrade({
          route: swapRoute,
          inputAmount: CurrencyAmount.fromRawAmount(
            CurrentConfig.tokens.in,
            fromReadableAmount(
              CurrentConfig.tokens.amountIn,
              CurrentConfig.tokens.in.decimals
            ).toString()
          ),
          outputAmount: CurrencyAmount.fromRawAmount(
            CurrentConfig.tokens.out,
            JSBI.BigInt(amountOut)
          ),
          tradeType: TradeType.EXACT_INPUT,
        })
      
        return uncheckedTrade
      }
      
      executeTrade = async (wallet: IWallet, trade: TokenTrade): Promise<TransactionState> => {
        const walletAddress = this.getWalletAddress(wallet)
      
        if (!walletAddress || !this.provider) {
          throw new Error('Cannot execute a trade without a connected wallet');
        }
      
        // Give approval to the router to spend the token
        const tokenApproval = await this.getTokenTransferApproval(wallet, CurrentConfig.tokens.in)
      
        // Fail if transfer approvals do not go through
        if (tokenApproval !== TransactionState.Sent) {
          return TransactionState.Failed
        }
      
        const options: SwapOptions = {
          slippageTolerance: new Percent(500, 10000), // 50 bips, or 0.50%
          deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
          recipient: walletAddress.address,
        }
      
        const methodParameters = SwapRouter.swapCallParameters([trade], options)
      
        const tx = {
          data: methodParameters.calldata,
          to: SWAP_ROUTER_ADDRESS,
          value: methodParameters.value,
          from: walletAddress.address,
          maxFeePerGas: MAX_FEE_PER_GAS,
          maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        }
      
        const transactionResponse = await walletAddress.sendTransaction(tx);
      
        return transactionResponse.hash ? TransactionState.Sent : TransactionState.Failed;

      }
      
      // Helper Quoting and Pool Functions
      
      getOutputQuote = async (route: Route<Currency, Currency>) => {
        const provider = new ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
        if (!provider) throw new Error('No provider');
      
        if (!provider) {
          throw new Error('Provider required to get pool state')
        }
      
        const { calldata } = await SwapQuoter.quoteCallParameters(
          route,
          CurrencyAmount.fromRawAmount(
            CurrentConfig.tokens.in,
            fromReadableAmount(
              CurrentConfig.tokens.amountIn,
              CurrentConfig.tokens.in.decimals
            )
          ),
          TradeType.EXACT_INPUT,
          {
            useQuoterV2: true,
          }
        )
      
        const quoteCallReturnData = await provider.call({
          to: QUOTER_CONTRACT_ADDRESS,
          data: calldata,
        })
      
        return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData);
      }
      
    getTokenTransferApproval = async ( wallet: IWallet, token: Token ): Promise<TransactionState> => {
        const address = this.getWalletAddress(wallet)
        if (!this.provider || !address) {
          console.log('No Provider Found')
          return TransactionState.Failed
        }
      
        try {
          const tokenContract = new ethers.Contract(
            token.address,
            ERC20_ABI,
            this.provider
          )
      
          const transaction = await tokenContract.populateTransaction.approve(
            SWAP_ROUTER_ADDRESS,
            TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER
          )
      
          const transactionResponse = await address.sendTransaction({
            ...transaction,
            from: address.address,
          })

          return transactionResponse.hash ? TransactionState.Sent : TransactionState.Failed;
        } catch (e) {
          console.error(e)
          return TransactionState.Failed
        }
      }
}

export default TradeRepository;

// Currencies and Tokens