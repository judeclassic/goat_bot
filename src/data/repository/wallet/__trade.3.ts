import { Token, TradeType, CurrencyAmount, Percent, ChainId, } from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

import {
  AlphaRouter,
  ID_TO_CHAIN_ID,
  //ChainId,
   SwapOptionsSwapRouter02,
  SwapRoute,
  // SwapRoute,
   SwapType,
} from '@uniswap/smart-order-router'
import JSBI from "jsbi";
import { ethers, BigNumber, utils } from 'ethers'
import { IOtherWallet, IWallet } from '../database/models/user'
import axios from 'axios';

import { ERC20ABI } from "./erc20_aba";
import { AnkrProvider } from '@ankr.com/ankr.js';
import { ANKR_PROVIDER_URL } from './wallet';

import { ISwapTokenInfo } from '../../types/repository/trade';
import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from '../../handler/trade/constants';
export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const SWETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const FEE_PERCENT = 0.5;

export const V3_UNISWAP_ROUTER_CONTRACT = "0xe592427a0aece92de3edee1f18e0157c05861564"
export const ETH_CONTRACT_ADDRESS = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"

const ETHERSCAN_API_KEY = 'XRSGJ71XPY5V7B76ICCSEPPVT9ZVFHXQTN';
// const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth_goerli/4265a1e74a32506d46ac1afa350f6fa9e2537741260b8202dfcb1849cf00d686' 
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f' 
// const V3_SWAP_CONTRACT_ADDRESS = '4265a1e74a32506d46ac1afa350f6fa9e2537741260b8202dfcb1849cf00d686';
const V3_SWAP_CONTRACT_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

class TradeRepository {
    provider: ethers.providers.JsonRpcProvider;
    private ankrProvider: AnkrProvider;
    poolContract: ethers.Contract;
    //infuraProvider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
        this.ankrProvider = new AnkrProvider(ANKR_PROVIDER_URL);
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
        const tokenPrice = await this.ankrProvider.getTokenPrice({ blockchain: "eth", contractAddress: contract_address });
        if (response.data.status === "1") {
            return {
                success: true,
                contract: {
                    coin_name: response?.data?.result?.[0].tokenName,
                    coin_symbol: response?.data?.result?.[0].tokenSymbol,
                    decimal: response?.data?.result?.[0].tokenDecimal,
                    contract_address: response?.data?.result?.[0].contractAddress,
                    balance: response?.data?.result?.[0].value,
                    constant_price: tokenPrice.usdPrice
                } as IOtherWallet
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
              coin_symbol: response?.data?.result?.[0].tokenSymbol,
              decimal: response?.data?.result?.[0].tokenDecimal,
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

        if (response.data.status === '1') {
          for (let i = 0; i < response.data.result.length; ) {
            if (balances.has(response.data.result[i].contractAddress)) continue;
            if (response.data.result[i].contractAddress) {
              balances.set(response.data.result[i].contractAddress, {
                coin_name: response.data.result[i].tokenSymbol,
                coin_symbol: response?.data?.result?.[0].tokenSymbol,
                decimal: response?.data?.result?.[0].tokenDecimal,
                contract_address: response.data.result[i].contractAddress,
                balance: response.data.result[i].value,
              })
            }
            if (i > 10) break;
          }
          return Array.from(balances.values());
        } else {
            return [] as IOtherWallet[];
        }
      } catch (err) {
        return [] as IOtherWallet[]
      }
  }

  swapEthToToken = async ({ tokenInfo, amount, slippage, wallet }:{
    tokenInfo: ISwapTokenInfo,
    amount: number,
    slippage: number,
    wallet: IWallet,
    gas_fee: number
  }) => {
    try {
      const tokenIn = new Token(
        ChainId.MAINNET,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        18,
        'WETH',
        'Wrapped Ether'
      )
      
      const tokenOut = new Token(
        ChainId.MAINNET,
        tokenInfo.contractAddress,
        parseInt(tokenInfo.decimal.toString()),
        tokenInfo.tokenSymbol,
        tokenInfo.tokenName
      )
          
      const response = await this.swapTokens({ tokenIn, tokenOut, amount, wallet });
      return response;
    } catch (err) {
      return {status: false, message: "unable to complete transaction" };
    }
  }

  swapTokenToEth = async ({ tokenInfo, amount, slippage, wallet }:{
    tokenInfo: ISwapTokenInfo,
    amount: number,
    slippage: number,
    wallet: IWallet,
    gas_fee: number
  }) => {
    try {
        const tokenOut = new Token(
          ChainId.MAINNET,
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          18,
          'WETH',
          'Wrapped Ether'
        )
        
        const tokenIn = new Token(
          ChainId.MAINNET,
          tokenInfo.contractAddress,
          parseInt(tokenInfo.decimal.toString()),
          tokenInfo.tokenSymbol,
          tokenInfo.tokenName
        )
            
        const response = await this.swapTokens({ tokenIn, tokenOut, amount, wallet });
        return response;
      } catch (err) {
        console.log(err);
        return {status: false, message: "unable to complete transaction" };
      }
  }

  swapTokens = async ({ tokenIn, tokenOut, amount, wallet }:{
    tokenIn: Token,
    tokenOut: Token,
    amount: number,
    wallet: IWallet
  }) => {
    try {
      // const router = new AlphaRouter({
      //   chainId: ChainId.MAINNET,
      //   provider: this.provider,
      // })

      // const rawTokenAmountIn = this.fromReadableAmount(
      //   amount,
      //   tokenIn.decimals
      // ).toString()

      //console.log('rawTokenAmount', rawTokenAmountIn)
    
      // const options: SwapOptionsSwapRouter02 = {
      //   recipient: wallet.address,
      //   slippageTolerance: new Percent(50, 10_000),
      //   deadline: Math.floor(Date.now() / 1000 + 1800),
      //   type: SwapType.SWAP_ROUTER_02,
      // }
    
      // const route = await router.route(
      //   CurrencyAmount.fromRawAmount(
      //     tokenIn,
      //     rawTokenAmountIn
      //   ),
      //   tokenOut,
      //   TradeType.EXACT_INPUT,
      //   options
      // )

      // //console.log('route', route)
      // if (!route?.methodParameters) return {status: false, message: "Token can not be pair to eth" };
      //console.log("route?.methodParameters: ", route?.methodParameters)

      const userWallet = new ethers.Wallet(wallet.private_key, this.provider);

      // const tokenAbi = await this.getABI(tokenIn.address);

      // const tokenContract = new ethers.Contract(
      //   tokenIn.address,
      //   tokenAbi,
      //   this.provider
      // )

      // console.log((parseInt(rawTokenAmountIn.toString()) * 2).toString());
      // console.log(ethers.BigNumber.from(rawTokenAmountIn.toString()))
      
      // const tokenApproval = await tokenContract.connect(userWallet).approve(
      //     V3_SWAP_CONTRACT_ADDRESS,
      //     ethers.BigNumber.from(rawTokenAmountIn.toString()),
      //     {
      //       gasLimit: ethers.utils.hexlify(100000),
      //     }
      // )
      
      // const tokenApproval = await tokenContract.connect(userWallet).approve(
      //     V3_SWAP_CONTRACT_ADDRESS,
      //     this.fromReadableAmount(
      //       amount * 2,
      //       tokenIn.decimals
      //     ).toString()
      // )

     
      // console.log("tokenApproval: ", tokenApproval);

      const gasPrice = await this.provider.getGasPrice();
      

      // const txRes = await userWallet.sendTransaction({
      //   data: route.methodParameters.calldata,
      //   to: V3_SWAP_CONTRACT_ADDRESS,
      //   value: route.methodParameters.value,
      //   from: wallet.address,
      //   gasLimit: ethers.utils.hexlify(40000),
      // })

      //  console.log('txRes', txRes)

      // const nonce = await userWallet.getTransactionCount();

      // const txRes = await userWallet.signTransaction({
      //   nonce: ethers.utils.hexlify(nonce),
      //   data: route.methodParameters.calldata,
      //   to: V3_SWAP_CONTRACT_ADDRESS,
      //   value: route.methodParameters.value,
      //   from: wallet.address,
      //   gasLimit: ethers.utils.hexlify(40000),
      //   chainId: 1,
      //   gasPrice,
      // })

      // console.log('txRes', txRes)

      // const recip = await this.provider.sendTransaction(txRes)
      // console.log('recipt', recip)

      // const resTrx = await recip.wait;

      // console.log('resTrx', resTrx)

      ///////////////////////
      ////////////////////
      /// dave /////////
      //const provider = this.provider
      const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/40544a9882294178bf9427be38bea3a5');

      const routerAddress =  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
        //const tokenContractAddress = tokenIn.address;
        const GOERLIADDRESS = '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D'
        const UNIADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
        const tokenContractAddress = GOERLIADDRESS
        const routerAbi = await this.getABI(routerAddress);
        //const tokenAbi = await this.getABI(tokenContractAddress);
        const tokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
        //console.log('abi', routerAbi)

        const walletWithProvider = new ethers.Wallet(wallet.private_key, provider);


      // Create instances of router and token contract
      const router = new ethers.Contract(routerAddress, routerAbi, walletWithProvider);
      const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, walletWithProvider);

      const amountIn = ethers.utils.parseEther(amount.toString());
      const gas_fee = await provider.getGasPrice();

      
      // const approval = await tokenContract.connect(walletWithProvider).approve(
      //   routerAddress, 
      //   amountIn,
      //   {gasLimit: ethers.utils.hexlify(100000),}
      //   );

      // //  // Wait for approval transaction confirmation
      //   await approval.wait();

       // Define swap parameters (replace with appropriate values)
        const deadline = Math.floor(Date.now() / 1000 + 60 * 20); // 20 minutes from now
        const slippageTolerance = ethers.utils.parseUnits('50', 'ether');
        const amountOutMin = 0; // Define the minimum amount of token expected
        // const path = [tokenIn.address, tokenOut.address]; // From ETH to Token
        const path = [tokenContractAddress, UNIADDRESS]; // From ETH to Token

       
        console.log('gas fee', gas_fee)

        const to = wallet.address;

    
        // Build swap transaction
        const tx = await router.swapExactETHForTokens(
            amountOutMin,
            path,
            wallet.address,
            deadline,
            { value: amountIn, gasLimit: ethers.utils.hexlify(40000) }
        );

        // const tx = await router.swapExactTokensForTokens(
        //   amountIn,
        //   amountOutMin,
        //   path,
        //   wallet.address,
        //   { gasLimit: 40000, }
        // );
        

         //Send the transaction
         const txResponse = await walletWithProvider.sendTransaction(tx);


         // Wait for the transaction confirmation
         const res = await txResponse.wait();

         console.log('res', res)



      return {status: true, message: "transaction completed" };
    } catch (err) {
      console.log("Error :", err)
      return { status: false, message: "unable to complete transaction" };
    }
  }

  private fromReadableAmount(amount: number, decimals: number): JSBI {
    const extraDigits = Math.pow(10, this.countDecimals(amount))
    const adjustedAmount = amount * extraDigits
    return JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(Math.round(adjustedAmount)),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
      ),
      JSBI.BigInt(extraDigits)
    )
  }

  private countDecimals = (x: number) => {
    if (Math.floor(x) === x) {
      return 0
    }
    return x.toString().split('.')[1].length || 0
  }
}

export default TradeRepository;