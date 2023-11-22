import { Token, TradeType, CurrencyAmount, Percent, } from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Trade } from '@uniswap/v3-sdk'
import {
  AlphaRouter,
  //ChainId,
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
import { AnkrProvider } from '@ankr.com/ankr.js';
import { ANKR_PROVIDER_URL } from './wallet';
import { UniswapRouterContract } from './uniswap_abi';
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
      console.log(1)

      //const web3Provider = new ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
      const web3Provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli/4265a1e74a32506d46ac1afa350f6fa9e2537741260b8202dfcb1849cf00d686');

      const ChainId = 1;
    //   const router = new AlphaRouter({chainId: ChainId, provider: web3Provider});
    //   console.log(2)

      const name0 = 'Wrapped Ether';
      const symbol0 = 'WETH';
      const decimal0 = 18;
     const address0 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

      const decimal1 = parseFloat(decimal.toString());
      const address1 = contract_address;

    //   const WETH = new Token(ChainId, address0, decimal0, symbol0, name0);
    //   const ERC20 = new Token(ChainId, address1, decimal1);

    //  console.log(3)

    //   const wei = ethers.utils.parseUnits(amount.toString(), 18);
    //   const inputAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei));

    //   console.log(4)

    //   const options: SwapOptionsSwapRouter02 = {
    //     recipient: wallet.address,
    //     slippageTolerance: new Percent(50, 10_000),
    //     deadline: Math.floor(Date.now()/1000 + 1800),
    //     type: SwapType.SWAP_ROUTER_02,
    //   }

    //   console.log(5)

      // const rawTokenAmountIn: JSBI =  this.fromReadableAmount(amount, decimal0)

      // console.log('rowtokenIn', rawTokenAmountIn)

   

      // const route = await router.route(
      //   CurrencyAmount.fromRawAmount(
      //     WETH,
      //     rawTokenAmountIn
      //   ),
      //   ERC20,
      //   TradeType.EXACT_INPUT,
      //   options
      // )

      // const route = await router.route(
      //   inputAmount,
      //   ERC20,
      //   TradeType.EXACT_INPUT,
      //   options
      // )

      // if (!route || !route.methodParameters) {
      //   return { 
      //     status: false,
      //     message: "unable to initailize route"
      //   }
      // }

      // let equivalentAmount: any = route?.quote.toFixed(10)
      // const amountOutMinWei = ethers.utils.parseUnits(equivalentAmount, 18);

      // console.log('out', equivalentAmount)
      // console.log('amoutOut', amountOutMinWei)

      // get ether balance in wei
      // const balanceWei = await web3Provider.getBalance(wallet.address);

      // console.log(6)
      // console.log(balanceWei)

      // // Convert Wei to Ether
      // const balanceEther = ethers.utils.formatEther(balanceWei);

      // console.log(7)

      // console.log('value', route?.methodParameters?.value);
      // console.log('ethValue', ethers.utils.formatEther(route?.methodParameters?.value))

      // if (parseFloat(balanceEther) < amount) {
      //   return { 
      //     status: false,
      //     message: "you don't have enough ether"
      //   }
      // }

      
      
      // const transaction = {
      //   data: route.methodParameters.calldata,
      //   to: V3_SWAP_CONTRACT_ADDRESS,
      //   value: BigNumber.from(route?.methodParameters?.value),
      //   //value: ethers.utils.parseUnits(amount.toString(), 18),
      //   from: wallet.address,
      //   // gasPrice: BigNumber.from(route?.gasPriceWei),
      //   // gasLimit: ethers.utils.hexlify(1000000),
      //   // maxFeePerGas: 100000000000,
      //   // maxPriorityFeePerGas: 100000000000,
      //   //gasLimit: 100000000000,
      //   // gasPrice: BigNumber.from(route?.gasPriceWei),
      //   //gasLimit: 100000000000
      //   //gasPrice: BigNumber.from(route?.gasPriceWei),
      //   //gasLimit: ethers.utils.hexlify(23796),
      //   gasLimit: ethers.utils.hexlify(100000)
      // }

      // const wallets = new ethers.Wallet(wallet.private_key);
      // const connectedWallet = wallets.connect(web3Provider);

      // const approveAmout = ethers.utils.parseUnits(amount.toString(), 18).toString();

      // const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider);


      // // Estimate gas limit
      // const gasLimit = await contract0.estimateGas.approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout);

      //Build transaction
      // const buildApproveTransaction = await contract0.connect(connectedWallet).approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout, {
      //   gasLimit: gasLimit.mul(2), // You can adjust the gas limit multiplier as needed
      //   gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Set your preferred gas price
      // });

      // const ROUTTER_SWAP_CONTRACT = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'

      // const allowance = await contract0.allowance(wallet.address, V3_SWAP_CONTRACT_ADDRESS);

      // // Wait for the transaction to be mined
      // //const approveTransaction = await buildApproveTransaction;
      // console.log('allowance', ethers.utils.formatEther(allowance))
      // console.log(8)
      // // const tradeTransaction = await connectedWallet.sendTransaction(transaction);
      // console.log('transation', tradeTransaction);

      // Import web3 and the router ABI
      

      ///////////////////////////
      /////  this fornDave ///////
      ///////////////////////////

      // const V3SWAPROUTERADDRESS = '0xe592427a0aece92de3edee1f18e0157c05861564'
      // const  WETHADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
      // const UNIADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
      // const DAIADDRESS = '0x73967c6a0904aA032C103b4104747E88c566B1A2'
      // const GOERLIADDRESS = '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D'
      // const myWallet = wallet.address
      // const mySecret = wallet.private_key
      // const wallete = new ethers.Wallet(mySecret)
      // const signer = wallete.connect(web3Provider)
      // const { routerAbi } = require('./../wallet/router_abi')

      // // Connect to the Ethereum network
      // const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/40544a9882294178bf9427be38bea3a5');

      // // Create a contract instance for the router
      // const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Uniswap V2 Router address
      // const router = new ethers.Contract(V3SWAPROUTERADDRESS, routerAbi, provider);

      // // Define the swap parameters
      // const tokenA = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI address
      // const tokenB = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH address
      // const amountIn = ethers.utils.parseEther(amount.toString()); // 1 DAI
      // const amountOutMin = ethers.utils.parseEther('0'); // minimum amount of WETH to receive
      // const path = [GOERLIADDRESS, DAIADDRESS]; // the swap path
      // const to = wallet.address; // the recipient address
      // const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      // // Create the swap transaction
      // const swapTx = await router.populateTransaction.swapExactTokensForTokens(
      //   amountIn,
      //   amountOutMin,
      //   path,
      //   to,
      //   deadline
      // );

      // //console.log('swapTx', swapTx)

      // // Get the gas estimate
      // // const gas = await router.estimateGas.swapExactTokensForTokens(
      // //   amountIn,
      // //   amountOutMin,
      // //   path,
      // //   to,
      // //   deadline
      // // );

      // // console.log('gas', gas)

      // // Get the current gas price
      // const gasPrice = await provider.getGasPrice();

      // console.log('gasPrice', gasPrice)

      // // Sign the transaction with the user's private key
      // const privateKey = wallet.private_key;

      // const wallets = new ethers.Wallet(privateKey, provider);
      

      // // Get the current nonce for the sender
      // const nonce = await wallets.getTransactionCount();

      
      // const signedTx = await wallets.signTransaction({
      //   nonce: ethers.utils.hexlify(nonce),
      //   to: V3SWAPROUTERADDRESS,
      //   data: swapTx.data,
      //   gasLimit: ethers.utils.hexlify(100000),
      //   gasPrice,
      //   chainId: 5,
      // });

      // console.log('signedTx', signedTx)

      // // // Wait for the transaction to be mined
      // // const recipt = await signedTx.wait();
      // const recipt = await provider.sendTransaction(signedTx);

      // const me = recipt.chainId
      // console.log('chaiId', me)
      //  console.log(`Transaction Recipt: ${recipt}`);



      //////////////////////
      // tihis wale ////////
      ////////////////////

      const V3SWAPROUTERADDRESS = '0xe592427a0aece92de3edee1f18e0157c05861564'
      const  WETHADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
      const UNIADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
      const DAIADDRESS = '0x73967c6a0904aA032C103b4104747E88c566B1A2'
      const GOERLIADDRESS = '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D'
      const myWallet = wallet.address
      const mySecret = wallet.private_key
      const wallete = new ethers.Wallet(mySecret)
      const signer = wallete.connect(web3Provider)

      // const contract0 = new ethers.Contract(GOERLIADDRESS, ERC20ABI, web3Provider);


      // const balance = await contract0.balanceOf(myWallet);
      // const balanceEther = ethers.utils.formatEther(balance);

      // console.log("gearli", balanceEther)

      //get ether balance in wei
      const balanceWei = await web3Provider.getBalance(wallet.address);

      console.log(6)
      console.log(balanceWei)

      // Convert Wei to Ether
      const balanceEther = ethers.utils.formatEther(balanceWei);
      console.log('banlanceEth', balanceEther)

      const contract0 = new ethers.Contract(GOERLIADDRESS, ERC20ABI, web3Provider);

      const approveAmout = ethers.utils.parseUnits(amount.toString(), 18).toString();

      // Estimate gas limit
      // const gasLimit = await contract0.estimateGas.approve(V3SWAPROUTERADDRESS, approveAmout);

      //Build transaction
      const buildApproveTransaction = await contract0.connect(signer).approve(V3SWAPROUTERADDRESS, approveAmout, {
        gasLimit: ethers.utils.hexlify(100000), // You can adjust the gas limit multiplier as needed
        gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Set your preferred gas price
      });

      const approveRecipt = await buildApproveTransaction.wait()

      console.log('approveRecipt', approveRecipt)
      // console.log('approve', buildApproveTransaction)

      const allowance = await contract0.allowance(myWallet, V3SWAPROUTERADDRESS);

      // Wait for the transaction to be mined
      //const approveTransaction = await buildApproveTransaction;
      console.log('allowance', ethers.utils.formatEther(allowance))


      const swapRouterContrat = new ethers.Contract(
        V3SWAPROUTERADDRESS,
        UniswapRouterContract 
      )

      const param = {
        tokenIn: GOERLIADDRESS,
        tokenOut: UNIADDRESS,
        fee: 3000,
        recipient: myWallet, 
        deadline: Math.floor(Date.now()/1000) + (60 * 10),
        amountIn: ethers.utils.parseEther('0.001'),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      }

      //console.log('V#contract', swapRouterContrat)

      const encDatal = swapRouterContrat.interface.encodeFunctionData("exactInputSingle", [param]);
      //console.log('encDatal', encDatal)SSSS

      // const calls = [encDatal,]

      // const multiCall = swapRouterContrat.interface.encodeFunctionData("multicall", [calls]);
      // console.log('multicall', multiCall)
      
      // const txArg = {
      //   to: V3SWAPROUTERADDRESS,
      //   from: myWallet,
      //   data: multiCall SSSSSSSSSS
      // };
      const nonce = await signer.getTransactionCount();

      const txArg = {
        nonce: ethers.utils.hexlify(nonce),
        to: V3SWAPROUTERADDRESS,
        from: myWallet,
        data: encDatal,
        gasLimit: ethers.utils.hexlify(100000),
        chainId: 5,
      };


      //const tx = await signer.sendTransaction(txArg);
      const tx = await signer.signTransaction(txArg);

      console.log('tx', tx);

      // const recept = await tx.wait()
      const recept = await web3Provider.sendTransaction(tx)
      console.log('recept', recept)
     
      return {
        status: true,
        amount: 20,
        ether: 40,
        trade: "tradeTransaction"
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
    
        const decimal0 = parseFloat(decimal.toString());
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

        console.log(`qoute is ${route?.quote.toFixed(10)}`)

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
        if (parseFloat(balanceEther) < amount) {
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
          trade: 'tradeTransaction'
        }
      } catch (err) {
        console.log(err);
        return {status: false, message: "unable to complete transaction" };
      }
  }

  fromReadableAmount(amount: number, decimals: number): JSBI {
    function countDecimals(value: any) {
      if (Math.floor(value) === value) return 0;
      return value.toString().split(".")[1].length || 0;
    }
    const extraDigits = Math.pow(10, countDecimals(amount))
    const adjustedAmount = amount * extraDigits
    return JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(adjustedAmount),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
      ),
      JSBI.BigInt(extraDigits)
    )
  }
}

export default TradeRepository;

console.log(new Date(1700405331))

console.log(Date.parse((new Date()).toISOString()) + (1000 * 60 * 60))