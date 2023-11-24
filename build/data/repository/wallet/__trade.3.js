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
const jsbi_1 = __importDefault(require("jsbi"));
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const ankr_js_1 = require("@ankr.com/ankr.js");
const wallet_1 = require("./wallet");
exports.POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
exports.SWETH_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
exports.FEE_PERCENT = 0.5;
exports.V3_UNISWAP_ROUTER_CONTRACT = "0xe592427a0aece92de3edee1f18e0157c05861564";
exports.ETH_CONTRACT_ADDRESS = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe";
const ETHERSCAN_API_KEY = 'XRSGJ71XPY5V7B76ICCSEPPVT9ZVFHXQTN';
// const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth_goerli/4265a1e74a32506d46ac1afa350f6fa9e2537741260b8202dfcb1849cf00d686' 
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
// const V3_SWAP_CONTRACT_ADDRESS = '4265a1e74a32506d46ac1afa350f6fa9e2537741260b8202dfcb1849cf00d686';
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
        this.swapEthToToken = ({ tokenInfo, amount, slippage, wallet }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenIn = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether');
                const tokenOut = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, tokenInfo.contractAddress, parseInt(tokenInfo.decimal.toString()), tokenInfo.tokenSymbol, tokenInfo.tokenName);
                const response = yield this.swapTokens({ tokenIn, tokenOut, amount, wallet });
                return response;
            }
            catch (err) {
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.swapTokenToEth = ({ tokenInfo, amount, slippage, wallet }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenOut = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether');
                const tokenIn = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, tokenInfo.contractAddress, parseInt(tokenInfo.decimal.toString()), tokenInfo.tokenSymbol, tokenInfo.tokenName);
                const response = yield this.swapTokens({ tokenIn, tokenOut, amount, wallet });
                return response;
            }
            catch (err) {
                console.log(err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.swapTokens = ({ tokenIn, tokenOut, amount, wallet }) => __awaiter(this, void 0, void 0, function* () {
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
                const userWallet = new ethers_1.ethers.Wallet(wallet.private_key, this.provider);
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
                const gasPrice = yield this.provider.getGasPrice();
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
                const provider = new ethers_1.ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/40544a9882294178bf9427be38bea3a5');
                const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
                //const tokenContractAddress = tokenIn.address;
                const GOERLIADDRESS = '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D';
                const UNIADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
                const tokenContractAddress = GOERLIADDRESS;
                const routerAbi = yield this.getABI(routerAddress);
                //const tokenAbi = await this.getABI(tokenContractAddress);
                const tokenAbi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "account", "type": "address" }], "name": "isMinter", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "name", "type": "string" }, { "name": "symbol", "type": "string" }, { "name": "decimals", "type": "uint8" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }];
                //console.log('abi', routerAbi)
                const walletWithProvider = new ethers_1.ethers.Wallet(wallet.private_key, provider);
                // Create instances of router and token contract
                const router = new ethers_1.ethers.Contract(routerAddress, routerAbi, walletWithProvider);
                const tokenContract = new ethers_1.ethers.Contract(tokenContractAddress, tokenAbi, walletWithProvider);
                const amountIn = ethers_1.ethers.utils.parseEther(amount.toString());
                const gas_fee = yield provider.getGasPrice();
                // const approval = await tokenContract.connect(walletWithProvider).approve(
                //   routerAddress, 
                //   amountIn,
                //   {gasLimit: ethers.utils.hexlify(100000),}
                //   );
                // //  // Wait for approval transaction confirmation
                //   await approval.wait();
                // Define swap parameters (replace with appropriate values)
                const deadline = Math.floor(Date.now() / 1000 + 60 * 20); // 20 minutes from now
                const slippageTolerance = ethers_1.ethers.utils.parseUnits('50', 'ether');
                const amountOutMin = 0; // Define the minimum amount of token expected
                // const path = [tokenIn.address, tokenOut.address]; // From ETH to Token
                const path = [tokenContractAddress, UNIADDRESS]; // From ETH to Token
                console.log('gas fee', gas_fee);
                const to = wallet.address;
                // Build swap transaction
                const tx = yield router.swapExactETHForTokens(amountOutMin, path, wallet.address, deadline, { value: amountIn, gasLimit: ethers_1.ethers.utils.hexlify(40000) });
                // const tx = await router.swapExactTokensForTokens(
                //   amountIn,
                //   amountOutMin,
                //   path,
                //   wallet.address,
                //   { gasLimit: 40000, }
                // );
                //Send the transaction
                const txResponse = yield walletWithProvider.sendTransaction(tx);
                // Wait for the transaction confirmation
                const res = yield txResponse.wait();
                console.log('res', res);
                return { status: true, message: "transaction completed" };
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
