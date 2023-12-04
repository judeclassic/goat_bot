import { Token, TradeType, CurrencyAmount, Percent, ChainId, } from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
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
import jwt from 'jsonwebtoken';

import { ERC20ABI } from "./erc20_aba";
import { AnkrProvider } from '@ankr.com/ankr.js';
import { ANKR_PROVIDER_URL } from './wallet';

import { ISwapTokenInfo } from '../../types/repository/trade';
import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from '../../handler/trade/constants';
import { WRAPPEDETHABI } from './wrappEth_abi';
import ICallback from '../../types/callback/callback';
export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const SWETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const FEE_PERCENT = 0.5;

export const V3_UNISWAP_ROUTER_CONTRACT = "0xe592427a0aece92de3edee1f18e0157c05861564"
export const ETH_CONTRACT_ADDRESS = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"

const ETHERSCAN_API_KEY = 'XRSGJ71XPY5V7B76ICCSEPPVT9ZVFHXQTN';
//const YOUR_ANKR_PROVIDER_URL = 'http://127.0.0.1:8545'
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f'
const V3_SWAP_CONTRACT_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const V2_SWAP_CONTRACT_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

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

    public encryptToken = (data: any) => {
        return jwt.sign(data, process.env.SECRET_ENCRYPTION_KEY!);
    }

    public decryptToken = (data: any): string => {
        return jwt.verify(data, process.env.SECRET_ENCRYPTION_KEY!) as string;
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

    getOtherTokens = async (wallet: IWallet): Promise<IOtherWallet[]> => {
      try {
          const tokens = await this.ankrProvider.getAccountBalance({walletAddress: wallet.address, onlyWhitelisted: false});
          const ethAssets = [] as IOtherWallet[];
          
          if (!tokens.assets.find((asset) => (!asset.contractAddress))) {
            const ethAsset = await this.ankrProvider.getTokenPrice({ blockchain: "eth", contractAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" });
            ethAssets.push({
                logo: "/assets/eth_logo.png",
                balance: "0.00",
                coin_name: 'Ether',
                balance_in_dollar: '0.00',
                coin_symbol: 'Eth',
                decimal: 18,
                constant_price: ethAsset.usdPrice,
                contract_address: 'eth'
            })
          }
          return [...ethAssets, ...tokens.assets.map((value) => ({
            logo: value.thumbnail,
            coin_name: value.tokenName,
            coin_symbol: value.tokenSymbol,
            constant_price: value.tokenPrice,
            decimal: value.tokenDecimals,
            contract_address: value.contractAddress,
            balance: proximate(value.balance),
            balance_in_dollar: proximate(value.balanceUsd)
        }))] as IOtherWallet[]
      } catch (err) {
        console.log(err)
          return [];
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
                    balance: "0",
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
  }, callback: (transaction: ICallback) => void) => {
    console.log({ tokenInfo, amount, slippage, wallet })
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
          
      const response = await this.swapEthToTokensHelp({ tokenIn, tokenOut, amount, wallet });
    
      callback({
        transactionHash: response.data?.hash,
        wallet: response.data?.addresss,
        transactionType: 'buy token',
        amount: amount
      });
      return response;
    } catch (err) {
      console.log("ERR: ", err)
      return {status: false, message: "unable to complete transaction" };
    }
  }

  swapTokenToEth = async ({ tokenInfo, amount, slippage, wallet }:{
    tokenInfo: ISwapTokenInfo,
    amount: number,
    slippage: number,
    wallet: IWallet,
    gas_fee: number
  }, callback: (transaction: ICallback) => void) => {
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
   
        const response = await this.swapTokensToEthHelp({ tokenIn, tokenOut, amount, wallet });
        callback({
          transactionHash: response.data?.hash,
          wallet: response.data?.addresss,
          transactionType: 'sell token',
          amount: amount
        });
        return response;
      } catch (err) {
        console.log(err);
        return {status: false, message: "unable to complete transaction" };
      }
  }

  swapEthToTokensHelp = async ({ tokenIn, tokenOut, amount, wallet }:{
    tokenIn: Token,
    tokenOut: Token,
    amount: number,
    wallet: IWallet
  }) => {
    try {
      
      console.log(1)

      const WALLET_ADDRESS = wallet.address
      const WALLET_SECRET = this.decryptToken(wallet.private_key);

      // const WALLET_ADDRESS = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
      // const WALLET_SECRET = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
  
      const web3Provider = this.provider;
  
      const wallete = new ethers.Wallet(WALLET_SECRET);
      const connectedWallet = wallete.connect(web3Provider);

      const address0 = tokenIn.address

      const address1 = tokenOut.address

      const contract0 = new ethers.Contract( address0, WRAPPEDETHABI, web3Provider);
      const contract1 = new ethers.Contract(address1, ERC20ABI, web3Provider);
      const router = new ethers.Contract(V2_SWAP_CONTRACT_ADDRESS, routerArtifact.abi, web3Provider)

      console.log(2)

      async function seee () {
        //banlance
        const ethBalance = await web3Provider.getBalance(WALLET_ADDRESS)
        const WrappedBal = await contract0.balanceOf(WALLET_ADDRESS);
        const daiBalance = await contract1.balanceOf(connectedWallet.address);
        
        console.log('eth balance', ethers.utils.formatEther(ethBalance))
        console.log(tokenIn.name, 'balance', ethers.utils.formatEther(WrappedBal))
        console.log(tokenOut.name,'balance', ethers.utils.formatEther(daiBalance))

      }

      console.log(3)

      console.log('wallet', WALLET_SECRET)

      await seee()

      const sendEth = await connectedWallet.sendTransaction({
      to: address0,
      value: ethers.utils.parseUnits(amount.toString(), 18),
      })

      console.log(4)
      await seee()

      const txGasLimit = await this.getGasPrices()
      const low = txGasLimit.gasPrices?.low
      const med = txGasLimit.gasPrices?.average
      const highGas= txGasLimit.gasPrices?.high 

      const approveAmout = ethers.utils.parseUnits(amount.toString(), 18).toString();
      
      //approve v3 swap contract
      const approveV3Contract = await contract0.connect(connectedWallet).approve(
      V2_SWAP_CONTRACT_ADDRESS,
      approveAmout, {
        gasPrice: ethers.utils.parseUnits(highGas, 'gwei'), // Set your preferred gas price
        //gasLimit: 300000,
      }
      );

      console.log(5)

      const approveRecc = await approveV3Contract.wait()

      const approveStatu = approveRecc.status

      console.log('approve status', approveStatu)

      console.log(6)

      const amountIn = ethers.utils.parseUnits(amount.toString(), 18).toString();
      const currentTimestamp = Math.floor(Date.now() / 1000) + 1800;
      //const times = await web3Provider.send("evm_setNextBlockTimestamp", [currentTimestamp * 2])

      const tx = await router.connect(connectedWallet).swapExactTokensForTokens(
          amountIn,
          0,
          [address0, address1],
          connectedWallet.address,
          currentTimestamp,
          {
            gasPrice: ethers.utils.parseUnits(highGas, 'gwei'), // Adjust the gas price
            //gasLimit: 300000,
          }
      )

      //console.log('tx', tx)

      console.log(7)

      const txWait = await tx.wait()
      

      //console.log('txWait', txWait)

      console.log(8)

      if (txWait.status === 0) {
          console.error('Transaction failed:', txWait);
          // Handle the failure, maybe increase gas or adjust other parameters
      }

      const transactionHash = txWait.transactionHash;
      const transactionAddress = txWait.from

      console.log('hash', transactionHash)
      console.log('address', transactionAddress)

      await seee()
      
      
      // return {status: true, message: "transaction completed" };
      return {status: true, data: {hash: transactionHash, addresss: transactionAddress} };
    } catch (err) {
      console.log("Error :", err)
      return { status: false, message: "unable to complete transaction" };
    }
  }


  swapTokensToEthHelp = async ({ tokenIn, tokenOut, amount, wallet }:{
    tokenIn: Token,
    tokenOut: Token,
    amount: number,
    wallet: IWallet
  }) => {
    try {
      
      console.log(1)

      const WALLET_ADDRESS = wallet.address
      const WALLET_SECRET = this.decryptToken(wallet.private_key)

      // const WALLET_ADDRESS = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
      // const WALLET_SECRET = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'

      const web3Provider = this.provider;
  
      const wallete = new ethers.Wallet(WALLET_SECRET);
      const connectedWallet = wallete.connect(web3Provider);

      const address0 = tokenIn.address

      const address1 = tokenOut.address

      const contract0 = new ethers.Contract( address0, ERC20ABI, web3Provider);
      const contract1 = new ethers.Contract(address1, WRAPPEDETHABI, web3Provider);
      const router = new ethers.Contract(V2_SWAP_CONTRACT_ADDRESS, routerArtifact.abi, web3Provider)
      
      //console.log(2)

      async function seee () {
        //banlance
        const ethBalance = await web3Provider.getBalance(WALLET_ADDRESS)
        const othertoken = await contract0.balanceOf(WALLET_ADDRESS);
        const WrappedToken = await contract1.balanceOf(connectedWallet.address);

        
        console.log('eth balance', ethers.utils.formatEther(ethBalance))
        console.log(tokenIn.name, 'balance', ethers.utils.formatEther(othertoken))
        console.log(tokenOut.name,'balance', ethers.utils.formatEther(WrappedToken))

      }

      console.log(3)

      await seee()

      const txGasLimit = await this.getGasPrices()
      const low = txGasLimit.gasPrices?.low
      const med = txGasLimit.gasPrices?.average
      const highGas= txGasLimit.gasPrices?.high

      console.log('high gass', highGas)

      console.log(4)
      await seee()

      const approveAmout = ethers.utils.parseUnits(amount.toString(), 18).toString();
  
      //approve v3 swap contract
      const approveV3Contract = await contract0.connect(connectedWallet).approve(
      V2_SWAP_CONTRACT_ADDRESS,
      approveAmout, {
        //gasLimit: 300000,
        gasPrice: ethers.utils.parseUnits(highGas, 'gwei'), // Adjust the gas price
      }
      );

      console.log(5)

      const approveRecc = await approveV3Contract.wait()

      const approveStatu = approveRecc.status

      console.log('approve status', approveStatu)
      console.log(6)

      //fetch wrapped eth banlance before swap
      const WrappedTokenBeforeSWap = await contract1.balanceOf(connectedWallet.address);
      const WrappedTokenBeforeSWapBal = ethers.utils.formatEther(WrappedTokenBeforeSWap)

      console.log(7)

      const amountIn = ethers.utils.parseUnits(amount.toString(), 18).toString();
      const currentTimestamp = Math.floor(Date.now() / 1000) + 1800;
      //const times = await web3Provider.send("evm_setNextBlockTimestamp", [currentTimestamp * 2])

      const tx = await router.connect(connectedWallet).swapExactTokensForTokens(
          amountIn,
          0,
          [address0, address1],
          connectedWallet.address,
          //times,
          currentTimestamp,
          {
            //gasLimit: 300000,
            gasPrice: ethers.utils.parseUnits(highGas, 'gwei'), // Adjust the gas price
          }
      )

      //console.log('tx', tx)

      console.log(8)

      const txWait = await tx.wait()

      //console.log('txWait', txWait)

      console.log(9)

      if (txWait.status === 0) {
          console.error('Transaction failed:', txWait);
          // Handle the failure, maybe increase gas or adjust other parameters
      }

      await seee()

      //fetch wrapped eth banlance after swap
      const WrappedTokenAfterSWap = await contract1.balanceOf(connectedWallet.address);
      const WrappedTokenAfterSWapBal = ethers.utils.formatEther(WrappedTokenAfterSWap)

      console.log(10)

      const amoutToWithdraw = parseFloat(WrappedTokenAfterSWapBal) - parseFloat(WrappedTokenBeforeSWapBal)

      console.log('wrapp to Eth', amoutToWithdraw)

      //convert wrapped eth to ether
      const convertToEth = await contract1.connect(connectedWallet).withdraw(
        ethers.utils.parseUnits(amoutToWithdraw.toFixed(18).toString(), 18).toString(),
        {
          //gasLimit: 300000,
          gasPrice: ethers.utils.parseUnits(highGas, 'gwei'), // Set your preferred gas price
        }
      );

      console.log(11)

      const convertTx = await convertToEth.wait()
      console.log('convex', convertToEth)

      console.log(12)
      await seee()

      const transactionHash = convertTx.transactionHash;
      const transactionAddress = convertTx.from

      await seee()  
      
      // return {status: true, message: "transaction completed" };
      return {status: true, data: {hash: transactionHash, addresss: transactionAddress} };
          
      //return {status: true, message: "transaction completed" };
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

const proximate = (value: string) => {
  return parseFloat(value).toPrecision(5);
};