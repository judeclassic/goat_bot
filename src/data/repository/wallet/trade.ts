import { Token, TradeType } from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress, Trade } from '@uniswap/v3-sdk'
import { ethers, Wallet, utils } from 'ethers'
import { CurrentConfig } from './config'
import { IOtherWallet, IWallet } from '../database/models/user'
import axios from 'axios';
import { tokenSwapAbi } from './our_abi'

export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
// export const WETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const SWETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const CONTRACT_ADDRESS = ''
export const FEE_PERCENT = 0.5;

const ETHERSCAN_API_KEY = 'XRSGJ71XPY5V7B76ICCSEPPVT9ZVFHXQTN';
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f'  
const YOUR_ANKR_PROVIDER_API_KEY = '56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f'  

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

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
        if (!this.provider) throw new Error('No provider');
        this.poolContract = new ethers.Contract( POOL_FACTORY_CONTRACT_ADDRESS, IUniswapV3PoolABI.abi, this.provider );
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
      const ethereumWallet = new Wallet(wallet.address);
      const fromAddress = wallet.address;
    
      // Get the nonce of the sender address
      const nonce = await ethereumWallet.getTransactionCount();
    
      // Create a transaction to send Ether to Ankr for swapping
      const tx = {
        to: contract_address,
        value: utils.parseEther(amount.toString()), // Amount in Ether
        nonce,
      };
    
      // Sign the transaction
      const txWithSignature = await ethereumWallet.signTransaction(tx);
    
      // Send the transaction to the Ethereum network
      const txResponse = await this.poolContract.provider.sendTransaction(txWithSignature);
    
      // Wait for the transaction to be mined
      await txResponse.wait();
    
      // Now, you can interact with the Ankr API to get your swapped tokens
      // You will need to check the Ankr API documentation for the specific endpoint and parameters.
    
      // Example:
      const ankrResponse = await this.performAnkrSwap({
        fromToken: 'ETH',
        toToken: contract_address,
        amount: amount,
      });
    
      // Handle the Ankr response as needed
      console.log('Ankr Response:', ankrResponse);
      return ankrResponse;
    } catch(err) {
      return err;
    }
  }

  performAnkrSwap = async ({
    fromToken,
    toToken,
    amount,
  }: {
    fromToken: string;
    toToken: string;
    amount: number;
  }) => {
    try {
      const ankrApiUrl = 'https://ankr-api-url.com/swap';

      // Define the data to send in the API request
      const requestData = {
        fromToken,
        toToken,
        amount,
      };

      // Set the request headers
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_ANKR_PROVIDER_API_KEY}`,
      };

      // Send a POST request to the Ankr API
      const response = await axios.post(ankrApiUrl, requestData, { headers });

      // Check the status of the response
      if (response.status === 200) {
        // The token swap was successful
        return { success: true, message: 'Token swap successful' };
      } else {
        // Handle the response according to your application's requirements
        return { success: false, message: 'Token swap failed' };
      }
    } catch (error) {
      // Handle any errors that occurred during the API request
      return { success: false, message: 'Ankr API error: ' + error };
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
        const walletAddress = new ethers.Wallet(wallet.private_key, this.provider);
        const tokenContract = new ethers.Contract(contract_address, tokenSwapAbi, walletAddress);

        const feeAmount = ethers.utils.parseEther((amount * FEE_PERCENT /100).toString());
        const { amountIn, amountOut } = deriveAmounts(amount, slippage);
        const swapPath = [
          contract_address,
          SWETH_CONTRACT_ADDRESS,
        ]
        const swapDeadline = getDeadline();
        const gasPrice = await this.provider.getGasPrice();
    
        // Then, call the swap function
        const tx = await tokenContract.swapETHForTokenWithFee(
          feeAmount,
          amountOut,
          swapPath,
          wallet.address,
          swapDeadline,
          { value: amountIn, gasPrice, gasLimit: 50000 });

        // const tx = await tokenContract.swapTokenForETHWithFee(
        //     amountIn,
        //     feeAmount,
        //     amountOut,
        //     swapPath,
        //     wallet.address,
        //     swapDeadline
        // );
        const receipt = await tx.wait();
        return receipt;
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