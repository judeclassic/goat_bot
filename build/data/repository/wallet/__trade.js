"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETH_CONTRACT_ADDRESS = exports.V3_UNISWAP_ROUTER_CONTRACT = exports.FEE_PERCENT = exports.SWETH_CONTRACT_ADDRESS = exports.POOL_FACTORY_CONTRACT_ADDRESS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const IUniswapV3Pool_json_1 = __importDefault(require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"));
const smart_order_router_1 = require("@uniswap/smart-order-router");
const jsbi_1 = __importDefault(require("jsbi"));
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const erc20_aba_1 = require("./erc20_aba");
const ankr_js_1 = require("@ankr.com/ankr.js");
const wallet_1 = require("./wallet");
const uniswap_abi_1 = require("./uniswap_abi");
exports.POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
exports.SWETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
exports.FEE_PERCENT = 0.5;
exports.V3_UNISWAP_ROUTER_CONTRACT = "0xe592427a0aece92de3edee1f18e0157c05861564";
exports.ETH_CONTRACT_ADDRESS = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe";
const ETHERSCAN_API_KEY = 'XRSGJ71XPY5V7B76ICCSEPPVT9ZVFHXQTN';
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
const YOUR_ANKR_PROVIDER_API_KEY = '56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
const V3_SWAP_CONTRACT_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
class TradeRepository {
    //infuraProvider: ethers.providers.JsonRpcProvider;
    constructor() {
        this.getABI = (contractAddress) => __awaiter(this, void 0, void 0, function* () {
            const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
            const response = yield axios_1.default.get(url);
            if (response.data.status === '1') {
                return JSON.parse(response.data.result);
            }
            else {
                throw new Error('Failed to fetch ABI');
            }
        });
        this.getCoinByContractAddress = ({ contract_address }) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                const response = yield axios_1.default.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contract_address}&page=1&offset=1&sort=desc&apikey=${ETHERSCAN_API_KEY}`);
                const tokenPrice = yield this.ankrProvider.getTokenPrice({ blockchain: "eth", contractAddress: contract_address });
                if (response.data.status === "1") {
                    return {
                        success: true,
                        contract: {
                            coin_name: (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0].tokenName,
                            coin_symbol: (_d = (_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d[0].tokenSymbol,
                            decimal: (_f = (_e = response === null || response === void 0 ? void 0 : response.data) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f[0].tokenDecimal,
                            contract_address: (_h = (_g = response === null || response === void 0 ? void 0 : response.data) === null || _g === void 0 ? void 0 : _g.result) === null || _h === void 0 ? void 0 : _h[0].contractAddress,
                            balance: (_k = (_j = response === null || response === void 0 ? void 0 : response.data) === null || _j === void 0 ? void 0 : _j.result) === null || _k === void 0 ? void 0 : _k[0].value,
                            constant_price: tokenPrice.usdPrice
                        }
                    };
                }
                else {
                    return { success: false, message: response.data.result };
                }
            }
            catch (error) {
                console.error('Error fetching gas prices:', error);
                return { success: false, message: 'Error fetching gas prices' };
            }
        });
        this.getGasPrices = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
                if (response.data.status === "1") {
                    return {
                        success: true,
                        gasPrices: {
                            low: response.data.result.SafeGasPrice,
                            average: response.data.result.ProposeGasPrice,
                            high: response.data.result.FastGasPrice
                        }
                    };
                }
                else {
                    return { success: false, message: response.data.result };
                }
            }
            catch (error) {
                console.error('Error fetching gas prices:', error);
                return { success: false, message: 'Error fetching gas prices' };
            }
        });
        this.getTokensInWalletByContract = ({ wallet }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=YOUR_TOKEN_CONTRACT_ADDRESS&address=${wallet.address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
                const response = yield axios_1.default.get(url);
                console.log(response);
                if (response.data.status === '1') {
                    return response.data.result.map((info) => {
                        var _a, _b, _c, _d;
                        return ({
                            coin_name: info.tokenSymbol,
                            coin_symbol: (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0].tokenSymbol,
                            decimal: (_d = (_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d[0].tokenDecimal,
                            contract_address: info.contractAddress,
                            balance: info.value,
                        });
                    });
                }
                else {
                    return [];
                }
            }
            catch (err) {
                console.log(err);
                return [];
            }
        });
        this.getListOfTokensInWallet = ({ wallet }) => __awaiter(this, void 0, void 0, function* () {
            var _l, _m, _o, _p;
            try {
                const balances = new Map();
                const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${wallet.address}&apikey=${ETHERSCAN_API_KEY}`;
                const response = yield axios_1.default.get(url);
                if (response.data.status === '1') {
                    for (let i = 0; i < response.data.result.length;) {
                        if (balances.has(response.data.result[i].contractAddress))
                            continue;
                        if (response.data.result[i].contractAddress) {
                            balances.set(response.data.result[i].contractAddress, {
                                coin_name: response.data.result[i].tokenSymbol,
                                coin_symbol: (_m = (_l = response === null || response === void 0 ? void 0 : response.data) === null || _l === void 0 ? void 0 : _l.result) === null || _m === void 0 ? void 0 : _m[0].tokenSymbol,
                                decimal: (_p = (_o = response === null || response === void 0 ? void 0 : response.data) === null || _o === void 0 ? void 0 : _o.result) === null || _p === void 0 ? void 0 : _p[0].tokenDecimal,
                                contract_address: response.data.result[i].contractAddress,
                                balance: response.data.result[i].value,
                            });
                        }
                        if (i > 10)
                            break;
                    }
                    return Array.from(balances.values());
                }
                else {
                    return [];
                }
            }
            catch (err) {
                return [];
            }
        });
        this.swapEthToToken = ({ contract_address, amount, slippage, wallet, decimal }) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({ contract_address, amount, slippage, wallet, decimal });
                const INFURA_URL = process.env.INFURA;
                console.log(1);
                //const web3Provider = new ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
                const web3Provider = new ethers_1.ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli/4265a1e74a32506d46ac1afa350f6fa9e2537741260b8202dfcb1849cf00d686');
                const ChainId = 1;
                //   const router = new AlphaRouter({chainId: ChainId, provider: web3Provider});
                //   console.log(2)
                const name0 = 'Wrapped Ether';
                const symbol0 = 'WETH';
                const decimal0 = 18;
                const address0 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
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
                const V3SWAPROUTERADDRESS = '0xe592427a0aece92de3edee1f18e0157c05861564';
                const WETHADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
                const UNIADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
                const DAIADDRESS = '0x73967c6a0904aA032C103b4104747E88c566B1A2';
                const GOERLIADDRESS = '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D';
                const myWallet = wallet.address;
                const mySecret = wallet.private_key;
                const wallete = new ethers_1.ethers.Wallet(mySecret);
                const signer = wallete.connect(web3Provider);
                // const contract0 = new ethers.Contract(GOERLIADDRESS, ERC20ABI, web3Provider);
                // const balance = await contract0.balanceOf(myWallet);
                // const balanceEther = ethers.utils.formatEther(balance);
                // console.log("gearli", balanceEther)
                //get ether balance in wei
                const balanceWei = yield web3Provider.getBalance(wallet.address);
                console.log(6);
                console.log(balanceWei);
                // Convert Wei to Ether
                const balanceEther = ethers_1.ethers.utils.formatEther(balanceWei);
                console.log('banlanceEth', balanceEther);
                const contract0 = new ethers_1.ethers.Contract(GOERLIADDRESS, erc20_aba_1.ERC20ABI, web3Provider);
                const approveAmout = ethers_1.ethers.utils.parseUnits(amount.toString(), 18).toString();
                // Estimate gas limit
                // const gasLimit = await contract0.estimateGas.approve(V3SWAPROUTERADDRESS, approveAmout);
                //Build transaction
                const buildApproveTransaction = yield contract0.connect(signer).approve(V3SWAPROUTERADDRESS, approveAmout, {
                    gasLimit: ethers_1.ethers.utils.hexlify(100000),
                    gasPrice: ethers_1.ethers.utils.parseUnits('20', 'gwei'), // Set your preferred gas price
                });
                const approveRecipt = yield buildApproveTransaction.wait();
                console.log('approveRecipt', approveRecipt);
                // console.log('approve', buildApproveTransaction)
                const allowance = yield contract0.allowance(myWallet, V3SWAPROUTERADDRESS);
                // Wait for the transaction to be mined
                //const approveTransaction = await buildApproveTransaction;
                console.log('allowance', ethers_1.ethers.utils.formatEther(allowance));
                const swapRouterContrat = new ethers_1.ethers.Contract(V3SWAPROUTERADDRESS, uniswap_abi_1.UniswapRouterContract);
                const param = {
                    tokenIn: GOERLIADDRESS,
                    tokenOut: UNIADDRESS,
                    fee: 3000,
                    recipient: myWallet,
                    deadline: Math.floor(Date.now() / 1000) + (60 * 10),
                    amountIn: ethers_1.ethers.utils.parseEther('0.001'),
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                };
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
                const nonce = yield signer.getTransactionCount();
                const txArg = {
                    nonce: ethers_1.ethers.utils.hexlify(nonce),
                    to: V3SWAPROUTERADDRESS,
                    from: myWallet,
                    data: encDatal,
                    gasLimit: ethers_1.ethers.utils.hexlify(100000),
                    chainId: 5,
                };
                //const tx = await signer.sendTransaction(txArg);
                const tx = yield signer.signTransaction(txArg);
                console.log('tx', tx);
                // const recept = await tx.wait()
                const recept = yield web3Provider.sendTransaction(tx);
                console.log('recept', recept);
                return {
                    status: true,
                    amount: 20,
                    ether: 40,
                    trade: "tradeTransaction"
                };
            }
            catch (err) {
                console.log("Error: ", err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.swapTokenToEth = ({ contract_address, amount, decimal, slippage, wallet, gas_fee }) => __awaiter(this, void 0, void 0, function* () {
            var _q, _r;
            try {
                const INFURA_URL = process.env.INFURA;
                const web3Provider = new ethers_1.ethers.providers.JsonRpcProvider(INFURA_URL);
                const ChainId = 1;
                const router = new smart_order_router_1.AlphaRouter({ chainId: ChainId, provider: web3Provider });
                const decimal0 = parseFloat(decimal.toString());
                const address0 = contract_address;
                const name1 = 'Wrapped Ether';
                const symbol1 = 'WETH';
                const decimal1 = 18;
                const address1 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
                const WETH = new sdk_core_1.Token(ChainId, address1, decimal1, symbol1, name1);
                const erc20Token = new sdk_core_1.Token(ChainId, address0, decimal0);
                const wei = ethers_1.ethers.utils.parseUnits(amount.toString(), 18);
                const inputAmount = sdk_core_1.CurrencyAmount.fromRawAmount(erc20Token, jsbi_1.default.BigInt(wei));
                const options = {
                    recipient: wallet.address,
                    slippageTolerance: new sdk_core_1.Percent(slippage, 100),
                    deadline: Math.floor(Date.now() / 1000 + 1800),
                    type: smart_order_router_1.SwapType.SWAP_ROUTER_02,
                };
                const route = yield router.route(inputAmount, WETH, sdk_core_1.TradeType.EXACT_INPUT, options);
                console.log(`qoute is ${route === null || route === void 0 ? void 0 : route.quote.toFixed(10)}`);
                const transaction = {
                    data: (_q = route === null || route === void 0 ? void 0 : route.methodParameters) === null || _q === void 0 ? void 0 : _q.calldata,
                    to: V3_SWAP_CONTRACT_ADDRESS,
                    value: ethers_1.BigNumber.from((_r = route === null || route === void 0 ? void 0 : route.methodParameters) === null || _r === void 0 ? void 0 : _r.value),
                    from: wallet.address,
                    gasPrice: ethers_1.BigNumber.from(route === null || route === void 0 ? void 0 : route.gasPriceWei),
                    gasLimit: ethers_1.ethers.utils.hexlify(1000000),
                };
                const wallets = new ethers_1.ethers.Wallet(wallet.private_key);
                const connectedWallet = wallets.connect(web3Provider);
                const approveAmout = ethers_1.ethers.utils.parseUnits(amount.toString(), 18).toString();
                const contract0 = new ethers_1.ethers.Contract(address0, erc20_aba_1.ERC20ABI, web3Provider);
                const balance = yield contract0.balanceOf(connectedWallet);
                const balanceEther = ethers_1.ethers.utils.formatEther(balance);
                //check if you have enough erc20 in your wallet
                if (parseFloat(balanceEther) < amount) {
                    return {
                        status: false,
                        message: "your balance is low for this token"
                    };
                }
                // // approve v3 swap contract
                // const approveV3Contract = await contract0.connect(connectedWallet).approve(
                //   V3_SWAP_CONTRACT_ADDRESS,
                //   approveAmout
                // );
                // Estimate gas limit
                const gasLimit = yield contract0.estimateGas.approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout);
                // Build transaction
                const buildApproveTransaction = yield contract0.connect(connectedWallet).approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout, {
                    gasLimit: gasLimit.mul(2),
                    gasPrice: ethers_1.ethers.utils.parseUnits('20', 'gwei'), // Set your preferred gas price
                });
                // Wait for the transaction to be mined
                const approveTransaction = yield buildApproveTransaction;
                const tradeTransaction = yield connectedWallet.sendTransaction(transaction);
                return {
                    status: true,
                    amount: route === null || route === void 0 ? void 0 : route.quote.toFixed(10),
                    trade: 'tradeTransaction'
                };
            }
            catch (err) {
                console.log(err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
        this.ankrProvider = new ankr_js_1.AnkrProvider(wallet_1.ANKR_PROVIDER_URL);
        //this.infuraProvider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        if (!this.provider)
            throw new Error('No provider');
        this.poolContract = new ethers_1.ethers.Contract(exports.POOL_FACTORY_CONTRACT_ADDRESS, IUniswapV3Pool_json_1.default.abi, this.provider);
    }
    fromReadableAmount(amount, decimals) {
        function countDecimals(value) {
            if (Math.floor(value) === value)
                return 0;
            return value.toString().split(".")[1].length || 0;
        }
        const extraDigits = Math.pow(10, countDecimals(amount));
        const adjustedAmount = amount * extraDigits;
        return jsbi_1.default.divide(jsbi_1.default.multiply(jsbi_1.default.BigInt(adjustedAmount), jsbi_1.default.exponentiate(jsbi_1.default.BigInt(10), jsbi_1.default.BigInt(decimals))), jsbi_1.default.BigInt(extraDigits));
    }
}
exports.default = TradeRepository;
console.log(new Date(1700405331));
console.log(Date.parse((new Date()).toISOString()) + (1000 * 60 * 60));
