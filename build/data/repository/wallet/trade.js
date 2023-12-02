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
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const jsbi_1 = __importDefault(require("jsbi"));
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const erc20_aba_1 = require("./erc20_aba");
const ankr_js_1 = require("@ankr.com/ankr.js");
const wallet_1 = require("./wallet");
const wrappEth_abi_1 = require("./wrappEth_abi");
exports.POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
exports.SWETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
exports.FEE_PERCENT = 0.5;
exports.V3_UNISWAP_ROUTER_CONTRACT = "0xe592427a0aece92de3edee1f18e0157c05861564";
exports.ETH_CONTRACT_ADDRESS = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe";
const ETHERSCAN_API_KEY = 'XRSGJ71XPY5V7B76ICCSEPPVT9ZVFHXQTN';
//const YOUR_ANKR_PROVIDER_URL = 'http://127.0.0.1:8545'
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
const V3_SWAP_CONTRACT_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const V2_SWAP_CONTRACT_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
class TradeRepository {
    //infuraProvider: ethers.providers.JsonRpcProvider;
    constructor() {
        this.encryptToken = (data) => {
            return jsonwebtoken_1.default.sign(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.decryptToken = (data) => {
            return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
        };
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
        this.swapEthToToken = ({ tokenInfo, amount, slippage, wallet }, callback) => __awaiter(this, void 0, void 0, function* () {
            var _q, _r;
            console.log({ tokenInfo, amount, slippage, wallet });
            try {
                const tokenIn = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether');
                const tokenOut = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, tokenInfo.contractAddress, parseInt(tokenInfo.decimal.toString()), tokenInfo.tokenSymbol, tokenInfo.tokenName);
                const response = yield this.swapEthToTokensHelp({ tokenIn, tokenOut, amount, wallet });
                callback({
                    transactionHash: (_q = response.data) === null || _q === void 0 ? void 0 : _q.hash,
                    wallet: (_r = response.data) === null || _r === void 0 ? void 0 : _r.addresss,
                    transactionType: 'buy token',
                    amount: amount
                });
                return response;
            }
            catch (err) {
                console.log("ERR: ", err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.swapTokenToEth = ({ tokenInfo, amount, slippage, wallet }, callback) => __awaiter(this, void 0, void 0, function* () {
            var _s, _t;
            try {
                const tokenOut = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether');
                const tokenIn = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, tokenInfo.contractAddress, parseInt(tokenInfo.decimal.toString()), tokenInfo.tokenSymbol, tokenInfo.tokenName);
                const response = yield this.swapTokensToEthHelp({ tokenIn, tokenOut, amount, wallet });
                callback({
                    transactionHash: (_s = response.data) === null || _s === void 0 ? void 0 : _s.hash,
                    wallet: (_t = response.data) === null || _t === void 0 ? void 0 : _t.addresss,
                    transactionType: 'sell token',
                    amount: amount
                });
                return response;
            }
            catch (err) {
                console.log(err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.swapEthToTokensHelp = ({ tokenIn, tokenOut, amount, wallet }) => __awaiter(this, void 0, void 0, function* () {
            var _u, _v, _w;
            try {
                console.log(1);
                const WALLET_ADDRESS = wallet.address;
                const WALLET_SECRET = this.decryptToken(wallet.private_key);
                // const WALLET_ADDRESS = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
                // const WALLET_SECRET = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
                const web3Provider = this.provider;
                const wallete = new ethers_1.ethers.Wallet(WALLET_SECRET);
                const connectedWallet = wallete.connect(web3Provider);
                const address0 = tokenIn.address;
                const address1 = tokenOut.address;
                const contract0 = new ethers_1.ethers.Contract(address0, wrappEth_abi_1.WRAPPEDETHABI, web3Provider);
                const contract1 = new ethers_1.ethers.Contract(address1, erc20_aba_1.ERC20ABI, web3Provider);
                const router = new ethers_1.ethers.Contract(V2_SWAP_CONTRACT_ADDRESS, routerArtifact.abi, web3Provider);
                console.log(2);
                function seee() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //banlance
                        const ethBalance = yield web3Provider.getBalance(WALLET_ADDRESS);
                        const WrappedBal = yield contract0.balanceOf(WALLET_ADDRESS);
                        const daiBalance = yield contract1.balanceOf(connectedWallet.address);
                        console.log('eth balance', ethers_1.ethers.utils.formatEther(ethBalance));
                        console.log(tokenIn.name, 'balance', ethers_1.ethers.utils.formatEther(WrappedBal));
                        console.log(tokenOut.name, 'balance', ethers_1.ethers.utils.formatEther(daiBalance));
                    });
                }
                console.log(3);
                console.log('wallet', WALLET_SECRET);
                yield seee();
                const sendEth = yield connectedWallet.sendTransaction({
                    to: address0,
                    value: ethers_1.ethers.utils.parseUnits(amount.toString(), 18),
                });
                console.log(4);
                yield seee();
                const txGasLimit = yield this.getGasPrices();
                const low = (_u = txGasLimit.gasPrices) === null || _u === void 0 ? void 0 : _u.low;
                const med = (_v = txGasLimit.gasPrices) === null || _v === void 0 ? void 0 : _v.average;
                const highGas = (_w = txGasLimit.gasPrices) === null || _w === void 0 ? void 0 : _w.high;
                const approveAmout = ethers_1.ethers.utils.parseUnits(amount.toString(), 18).toString();
                //approve v3 swap contract
                const approveV3Contract = yield contract0.connect(connectedWallet).approve(V2_SWAP_CONTRACT_ADDRESS, approveAmout, {
                    gasPrice: ethers_1.ethers.utils.parseUnits(highGas, 'gwei'), // Set your preferred gas price
                    //gasLimit: 300000,
                });
                console.log(5);
                const approveRecc = yield approveV3Contract.wait();
                const approveStatu = approveRecc.status;
                console.log('approve status', approveStatu);
                console.log(6);
                const amountIn = ethers_1.ethers.utils.parseUnits(amount.toString(), 18).toString();
                const currentTimestamp = Math.floor(Date.now() / 1000) + 1800;
                //const times = await web3Provider.send("evm_setNextBlockTimestamp", [currentTimestamp * 2])
                const tx = yield router.connect(connectedWallet).swapExactTokensForTokens(amountIn, 0, [address0, address1], connectedWallet.address, currentTimestamp, {
                    gasPrice: ethers_1.ethers.utils.parseUnits(highGas, 'gwei'), // Adjust the gas price
                    //gasLimit: 300000,
                });
                //console.log('tx', tx)
                console.log(7);
                const txWait = yield tx.wait();
                //console.log('txWait', txWait)
                console.log(8);
                if (txWait.status === 0) {
                    console.error('Transaction failed:', txWait);
                    // Handle the failure, maybe increase gas or adjust other parameters
                }
                const transactionHash = txWait.transactionHash;
                const transactionAddress = txWait.from;
                console.log('hash', transactionHash);
                console.log('address', transactionAddress);
                yield seee();
                // return {status: true, message: "transaction completed" };
                return { status: true, data: { hash: transactionHash, addresss: transactionAddress } };
            }
            catch (err) {
                console.log("Error :", err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.swapTokensToEthHelp = ({ tokenIn, tokenOut, amount, wallet }) => __awaiter(this, void 0, void 0, function* () {
            var _x, _y, _z;
            try {
                console.log(1);
                const WALLET_ADDRESS = wallet.address;
                const WALLET_SECRET = this.decryptToken(wallet.private_key);
                // const WALLET_ADDRESS = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
                // const WALLET_SECRET = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
                const web3Provider = this.provider;
                const wallete = new ethers_1.ethers.Wallet(WALLET_SECRET);
                const connectedWallet = wallete.connect(web3Provider);
                const address0 = tokenIn.address;
                const address1 = tokenOut.address;
                const contract0 = new ethers_1.ethers.Contract(address0, erc20_aba_1.ERC20ABI, web3Provider);
                const contract1 = new ethers_1.ethers.Contract(address1, wrappEth_abi_1.WRAPPEDETHABI, web3Provider);
                const router = new ethers_1.ethers.Contract(V2_SWAP_CONTRACT_ADDRESS, routerArtifact.abi, web3Provider);
                //console.log(2)
                function seee() {
                    return __awaiter(this, void 0, void 0, function* () {
                        //banlance
                        const ethBalance = yield web3Provider.getBalance(WALLET_ADDRESS);
                        const othertoken = yield contract0.balanceOf(WALLET_ADDRESS);
                        const WrappedToken = yield contract1.balanceOf(connectedWallet.address);
                        console.log('eth balance', ethers_1.ethers.utils.formatEther(ethBalance));
                        console.log(tokenIn.name, 'balance', ethers_1.ethers.utils.formatEther(othertoken));
                        console.log(tokenOut.name, 'balance', ethers_1.ethers.utils.formatEther(WrappedToken));
                    });
                }
                console.log(3);
                yield seee();
                const txGasLimit = yield this.getGasPrices();
                const low = (_x = txGasLimit.gasPrices) === null || _x === void 0 ? void 0 : _x.low;
                const med = (_y = txGasLimit.gasPrices) === null || _y === void 0 ? void 0 : _y.average;
                const highGas = (_z = txGasLimit.gasPrices) === null || _z === void 0 ? void 0 : _z.high;
                console.log('high gass', highGas);
                console.log(4);
                yield seee();
                const approveAmout = ethers_1.ethers.utils.parseUnits(amount.toString(), 18).toString();
                //approve v3 swap contract
                const approveV3Contract = yield contract0.connect(connectedWallet).approve(V2_SWAP_CONTRACT_ADDRESS, approveAmout, {
                    //gasLimit: 300000,
                    gasPrice: ethers_1.ethers.utils.parseUnits(highGas, 'gwei'), // Adjust the gas price
                });
                console.log(5);
                const approveRecc = yield approveV3Contract.wait();
                const approveStatu = approveRecc.status;
                console.log('approve status', approveStatu);
                console.log(6);
                //fetch wrapped eth banlance before swap
                const WrappedTokenBeforeSWap = yield contract1.balanceOf(connectedWallet.address);
                const WrappedTokenBeforeSWapBal = ethers_1.ethers.utils.formatEther(WrappedTokenBeforeSWap);
                console.log(7);
                const amountIn = ethers_1.ethers.utils.parseUnits(amount.toString(), 18).toString();
                const currentTimestamp = Math.floor(Date.now() / 1000) + 1800;
                //const times = await web3Provider.send("evm_setNextBlockTimestamp", [currentTimestamp * 2])
                const tx = yield router.connect(connectedWallet).swapExactTokensForTokens(amountIn, 0, [address0, address1], connectedWallet.address, 
                //times,
                currentTimestamp, {
                    //gasLimit: 300000,
                    gasPrice: ethers_1.ethers.utils.parseUnits(highGas, 'gwei'), // Adjust the gas price
                });
                //console.log('tx', tx)
                console.log(8);
                const txWait = yield tx.wait();
                //console.log('txWait', txWait)
                console.log(9);
                if (txWait.status === 0) {
                    console.error('Transaction failed:', txWait);
                    // Handle the failure, maybe increase gas or adjust other parameters
                }
                yield seee();
                //fetch wrapped eth banlance after swap
                const WrappedTokenAfterSWap = yield contract1.balanceOf(connectedWallet.address);
                const WrappedTokenAfterSWapBal = ethers_1.ethers.utils.formatEther(WrappedTokenAfterSWap);
                console.log(10);
                const amoutToWithdraw = parseFloat(WrappedTokenAfterSWapBal) - parseFloat(WrappedTokenBeforeSWapBal);
                console.log('wrapp to Eth', amoutToWithdraw);
                //convert wrapped eth to ether
                const convertToEth = yield contract1.connect(connectedWallet).withdraw(ethers_1.ethers.utils.parseUnits(amoutToWithdraw.toFixed(18).toString(), 18).toString(), {
                    //gasLimit: 300000,
                    gasPrice: ethers_1.ethers.utils.parseUnits(highGas, 'gwei'), // Set your preferred gas price
                });
                console.log(11);
                const convertTx = yield convertToEth.wait();
                console.log('convex', convertToEth);
                console.log(12);
                yield seee();
                const transactionHash = convertTx.transactionHash;
                const transactionAddress = convertTx.from;
                console.log('hash', transactionHash);
                console.log('address', transactionAddress);
                yield seee();
                // return {status: true, message: "transaction completed" };
                return { status: true, data: { hash: transactionHash, addresss: transactionAddress } };
                //return {status: true, message: "transaction completed" };
            }
            catch (err) {
                console.log("Error :", err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.countDecimals = (x) => {
            if (Math.floor(x) === x) {
                return 0;
            }
            return x.toString().split('.')[1].length || 0;
        };
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
        this.ankrProvider = new ankr_js_1.AnkrProvider(wallet_1.ANKR_PROVIDER_URL);
        //this.infuraProvider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        if (!this.provider)
            throw new Error('No provider');
        this.poolContract = new ethers_1.ethers.Contract(exports.POOL_FACTORY_CONTRACT_ADDRESS, IUniswapV3Pool_json_1.default.abi, this.provider);
    }
    fromReadableAmount(amount, decimals) {
        const extraDigits = Math.pow(10, this.countDecimals(amount));
        const adjustedAmount = amount * extraDigits;
        return jsbi_1.default.divide(jsbi_1.default.multiply(jsbi_1.default.BigInt(Math.round(adjustedAmount)), jsbi_1.default.exponentiate(jsbi_1.default.BigInt(10), jsbi_1.default.BigInt(decimals))), jsbi_1.default.BigInt(extraDigits));
    }
}
exports.default = TradeRepository;
console.log("Date: ", Date.parse((new Date()).toISOString()) + (1000 * 60 * 30));
