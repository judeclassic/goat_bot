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
                    coin_name: response?.data?.result?.[0].tokenName,
                    coin_symbol: response?.data?.result?.[0].tokenSymbol,
                    decimal: response?.data?.result?.[0].tokenDecimal,
                    contract_address: response?.data?.result?.[0].contractAddress,
                    balance: response?.data?.result?.[0].value
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

  swapEthToToken = async ({ contract_address, amount, slippage, wallet, decimal }:{
    contract_address: string, 
    amount: number,
    slippage: number,
    wallet: IWallet,
    decimal: number,
    gas_fee: number
  }) => {
    try {
      console.log({ contract_address, amount, slippage, wallet, decimal })
      const INFURA_URL = process.env.INFURA;

      const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

      const ChainId = 1;
      const router = new AlphaRouter({chainId: ChainId, provider: web3Provider});

      const name0 = 'Wrapped Ether';
      const symbol0 = 'WETH';
      const decimal0 = 18;
      const address0 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

      const decimal1 = parseInt(decimal.toString());
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

      // get ether balance in wei
      const balanceWei = await web3Provider.getBalance(wallet.address);

      // Convert Wei to Ether
      const balanceEther = ethers.utils.formatEther(balanceWei);

      if (parseInt(balanceEther) < amount) {
        return { 
          status: false,
          message: "you don't have enough ether"
        }
      }

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

      const approveAmout = ethers.utils.parseUnits(amount.toString(), 18).toString();

      const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider);

      // // approve v3 swap contract
      // const approveV3Contract = await contract0.connect(connectedWallet).approve(
      // V3_SWAP_CONTRACT_ADDRESS,
      // approveAmout
      // );

      // Estimate gas limit
      const gasLimit = await contract0.estimateGas.approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout);

      // Build transaction
      const buildApproveTransaction = await contract0.connect(connectedWallet).approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout, {
        gasLimit: gasLimit.mul(2), // You can adjust the gas limit multiplier as needed
        gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Set your preferred gas price
      });

      // Wait for the transaction to be mined
      const approveTransaction = await buildApproveTransaction;

      const tradeTransaction = await connectedWallet.sendTransaction(transaction);
      return {
        status: true,
        amount: route?.quote.toFixed(10),
        ether: balanceEther,
        trade: tradeTransaction
      }
    } catch(err) {
        console.log("Error: ", err)
        return {status: false, message: "unable to complete transaction" };
    }
  }
  
  swapTokenToEth = async ({ contract_address, amount, decimal, slippage, wallet, gas_fee }: {
    contract_address: string, 
    amount: number,
    slippage: number,
    decimal: number,
    wallet: IWallet,
    gas_fee: number
  }) => {

    try {
        const INFURA_URL = process.env.INFURA;

        const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        const ChainId = 1;
        const router = new AlphaRouter({chainId: ChainId, provider: web3Provider});
    
        const decimal0 = parseInt(decimal.toString());
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

        const approveAmout = ethers.utils.parseUnits(amount.toString(), 18).toString();

        const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider);


        const balance = await contract0.balanceOf(connectedWallet);
        const balanceEther = ethers.utils.formatEther(balance);

        //check if you have enough erc20 in your wallet
        if (parseInt(balanceEther) < amount) {
          return {
            status: false,
            message: "your balance is low for this token"
          }
        }

        // // approve v3 swap contract
        // const approveV3Contract = await contract0.connect(connectedWallet).approve(
        //   V3_SWAP_CONTRACT_ADDRESS,
        //   approveAmout
        // );

        // Estimate gas limit
        const gasLimit = await contract0.estimateGas.approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout);

        // Build transaction
        const buildApproveTransaction = await contract0.connect(connectedWallet).approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout, {
          gasLimit: gasLimit.mul(2), // You can adjust the gas limit multiplier as needed
          gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Set your preferred gas price
        });

        // Wait for the transaction to be mined
        const approveTransaction = await buildApproveTransaction;

        const tradeTransaction = await connectedWallet.sendTransaction(transaction);

        return {
          status: true,
          amount: route?.quote.toFixed(10),
          trade: tradeTransaction
        }
      } catch (err) {
        console.log(err);
        return {status: false, message: "unable to complete transaction" };
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