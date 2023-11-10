import { Token, TradeType, CurrencyAmount, Percent, } from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Trade } from '@uniswap/v3-sdk'
import {
  AlphaRouter,
  // ChainId,
   SwapOptionsSwapRouter02,
  // SwapRoute,
   SwapType,
} from '@uniswap/smart-order-router'
import JSBI from "jsbi";
import { ethers, BigNumber } from 'ethers'
import { IOtherWallet, IWallet } from '../database/models/user'
import axios from 'axios';
import { tokenSwapAbi } from './our_abi'
import { ERC20ABI } from "./erc20_aba";
export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const SWETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const FEE_PERCENT = 0.5;

export const V3_UNISWAP_ROUTER_CONTRACT = "0xe592427a0aece92de3edee1f18e0157c05861564"
export const ETH_CONTRACT_ADDRESS = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"

const ETHERSCAN_API_KEY = 'XRSGJ71XPY5V7B76ICCSEPPVT9ZVFHXQTN';
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f'  
const YOUR_ANKR_PROVIDER_API_KEY = '56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f'  

const V3_SWAP_CONTRACT_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

export type TokenTrade = Trade<Token, Token, TradeType>

export type TokenResponseType = {
  blockNumber: string,
  timeStamp: string,
  hash: string,
  nonce: string,
  blockHash: string,
  from: string,
  contractAddress: string,
  to: string,
  value: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimal: string,
  transactionIndex: string,
  gas: string,
  gasPrice: string,
  gasUsed: string,
  cumulativeGasUsed: string,
  input: string,
  confirmations: string
}

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
    poolContract: ethers.Contract;
    //infuraProvider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
        //this.infuraProvider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        if (!this.provider) throw new Error('No provider');
        this.poolContract = new ethers.Contract( POOL_FACTORY_CONTRACT_ADDRESS, IUniswapV3PoolABI.abi, this.provider );
    }

    getABI = async (contractAddress: string) => {
      const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
      
      const response = await axios.get(url);
      if (response.data.status === '1') {
          return JSON.parse(response.data.result);
      } else {
          throw new Error('Failed to fetch ABI');
      }
    }

    getCoinByContractAddress = async ({ contract_address }:{ contract_address: string }) => {
      try {
        const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contract_address}&page=1&offset=1&sort=desc&apikey=${ETHERSCAN_API_KEY}`);

        if (response.data.status === "1") {
            return {
                success: true,
                contract: {
                    name: "",
                    symbol: "",
                    contract_address: "",
                    image: "",
                    price: 0.00005
                }
            };
        } else {
            return { success: false, message: response.data.result };
        }
      } catch (error) {
        console.error('Error fetching gas prices:', error);
        return { success: false, message: 'Error fetching gas prices' };
      }
    }

    getGasPrices = async () => {
      try {
        const response = await axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
        if (response.data.status === "1") {
            return {
                success: true,
                gasPrices: {
                    low: response.data.result.SafeGasPrice,
                    average: response.data.result.ProposeGasPrice,
                    high: response.data.result.FastGasPrice
                }
            };
        } else {
            return { success: false, message: response.data.result };
        }
      } catch (error) {
        console.error('Error fetching gas prices:', error);
        return { success: false, message: 'Error fetching gas prices' };
      }

    }

    getTokensInWalletByContract = async ({ wallet }:{ wallet: IWallet }) => {
      try {
        const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=YOUR_TOKEN_CONTRACT_ADDRESS&address=${wallet.address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
        
        const response = await axios.get(url);

        console.log(response)

        if (response.data.status === '1') {
          return response.data.result.map((info: any) => ({
              coin_name: info.tokenSymbol,
              contract_address: info.contractAddress,
              balance: info.value,
            })) as IOtherWallet[];
        } else {
            return [] as IOtherWallet[];
        }
      } catch (err) {
        console.log(err)
        return []
      }
    }

    getListOfTokensInWallet = async ({ wallet }:{ wallet: IWallet }) => {
      try {
        const balances = new Map();
        const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${wallet.address}&apikey=${ETHERSCAN_API_KEY}`;
        
        const response = await axios.get(url);

        console.log(response.data)

        if (response.data.status === '1') {
          for (let i = 0; i < response.data.result.length; ) {
            if (balances.has(response.data.result[i].contractAddress)) continue;
            if (response.data.result[i].contractAddress) {

            }
          }
          return response.data.result.map((info: any) => ({
              coin_name: info.tokenSymbol,
              contract_address: info.contractAddress,
              balance: info.value,
            })) as IOtherWallet[];
        } else {
            return [] as IOtherWallet[];
        }
      } catch (err) {
        console.log(err)
        return []
      }
  }

  swapEthToToken = async ({ contract_address, amount, slippage, wallet, gas_fee }:{
    contract_address: string, 
    amount: number,
    slippage: number,
    wallet: IWallet,
    gas_fee: number
  }) => {
    try {
      const INFURA_URL = process.env.INFURA;

      const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

      const ChainId = 1;
      const router = new AlphaRouter({chainId: ChainId, provider: web3Provider});

      const name0 = 'Wrapped Ether';
      const symbol0 = 'WETH';
      const decimal0 = 18;
      const address0 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

      const decimal1 = 18;
      const address1 = contract_address;

      const WETH = new Token(ChainId, address0, decimal0, symbol0, name0);
      const ERC20 = new Token(ChainId, address1, decimal1);

      const wei = ethers.utils.parseUnits(amount.toString(), 18);
      const inputAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei));

      const options: SwapOptionsSwapRouter02 = {
        recipient: wallet.address,
        slippageTolerance: new Percent(slippage, 100),
        deadline: Math.floor(Date.now()/1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
      }

      const route = await router.route(
        inputAmount,
        ERC20,
        TradeType.EXACT_INPUT,
        options
      )

      //console.log(`qoute is ${route?.quote.toFixed(10)}`)

      const transaction = {
      data: route?.methodParameters?.calldata,
      to: V3_SWAP_CONTRACT_ADDRESS,
      value: BigNumber.from(route?.methodParameters?.value),
      from: wallet.address,
      gasPrice: BigNumber.from(route?.gasPriceWei),
      gasLimit: ethers.utils.hexlify(1000000),
      }

      const wallets = new ethers.Wallet(wallet.private_key);
      const connectedWallet = wallets.connect(web3Provider);

      const approveAmout = ethers.utils.parseUnits('1', 18).toString();

      const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider);

      // approve v3 swap contract
      const approveV3Contract = await contract0.connect(connectedWallet).approve(
      V3_SWAP_CONTRACT_ADDRESS,
      approveAmout
      );

      //console.log(`approve v3 contract ${approveV3Contract}`)

      const tradeTransaction = await connectedWallet.sendTransaction(transaction);

      //console.log(`trade transaction ${tradeTransaction}`)


      return {
        amoount: route?.quote.toFixed(10),
        trade: tradeTransaction
      }
    } catch(err) {
       console.log("Error: ", err)
      return err;
    }
  }
  
  swapTokenToEth = async ({ contract_address, amount, slippage, wallet, gas_fee }: {
    contract_address: string, 
    amount: number,
    slippage: number,
    wallet: IWallet,
    gas_fee: number
  }) => {

    try {
       
        const INFURA_URL = process.env.INFURA;

        const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        const ChainId = 1;
        const router = new AlphaRouter({chainId: ChainId, provider: web3Provider});
    
        const decimal0 = 18;
        const address0 = contract_address

        const name1 = 'Wrapped Ether';
        const symbol1 = 'WETH';
        const decimal1 = 18;
        const address1 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

        const WETH = new Token(ChainId, address1, decimal1, symbol1, name1);
        const erc20Token = new Token(ChainId, address0, decimal0);

        const wei = ethers.utils.parseUnits(amount.toString(), 18);
        const inputAmount = CurrencyAmount.fromRawAmount(erc20Token, JSBI.BigInt(wei));

        const options: SwapOptionsSwapRouter02 = {
          //recipient: wallet.address,
          recipient: wallet.address,
          slippageTolerance: new Percent(slippage, 100),
          deadline: Math.floor(Date.now()/1000 + 1800),
          type: SwapType.SWAP_ROUTER_02,
        }

        const route = await router.route(
          inputAmount,
          WETH,
          TradeType.EXACT_INPUT,
          options
        )

        //console.log(`qoute is ${route?.quote.toFixed(10)}`)

        const transaction = {
          data: route?.methodParameters?.calldata,
          to: V3_SWAP_CONTRACT_ADDRESS,
          value: BigNumber.from(route?.methodParameters?.value),
          from: wallet.address,
          gasPrice: BigNumber.from(route?.gasPriceWei),
          gasLimit: ethers.utils.hexlify(1000000),
        }

        const wallets = new ethers.Wallet(wallet.private_key);
        const connectedWallet = wallets.connect(web3Provider);

        const approveAmout = ethers.utils.parseUnits('3', 18).toString();

        const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider);

        // approve v3 swap contract
        const approveV3Contract = await contract0.connect(connectedWallet).approve(
          V3_SWAP_CONTRACT_ADDRESS,
          approveAmout
        );

        //console.log(`approve v3 contract ${approveV3Contract}`)

        const tradeTransaction = await connectedWallet.sendTransaction(transaction);

        //console.log(`trade transaction ${tradeTransaction}`)

        return {
          amoount: route?.quote.toFixed(10),
           trade: tradeTransaction
        }
      } catch (err) {
        return err;
      }
  }
}

const getDeadline = async () => {
  const currentUnixTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
  const buffer = 60 * 20; // 20 minutes buffer
  return currentUnixTimestamp + buffer;
};

const deriveAmounts = (amount: number, slippage: number) => {
  const amountIn = ethers.utils.parseEther(amount.toString());
  const slippageAdjustedAmount = amount * (1 - slippage / 100);
  const fee = amount * 0.01; // 1% fee
  const amountOut = ethers.utils.parseEther((slippageAdjustedAmount - fee).toString());
  return { amountIn, amountOut };
};


export default TradeRepository;

// Currencies and Tokens