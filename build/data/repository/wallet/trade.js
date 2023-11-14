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
                if (response.data.status === "1") {
                    return {
                        success: true,
                        contract: {
                            coin_name: (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0].tokenName,
                            coin_symbol: (_d = (_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d[0].tokenSymbol,
                            decimal: (_f = (_e = response === null || response === void 0 ? void 0 : response.data) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f[0].tokenDecimal,
                            contract_address: (_h = (_g = response === null || response === void 0 ? void 0 : response.data) === null || _g === void 0 ? void 0 : _g.result) === null || _h === void 0 ? void 0 : _h[0].contractAddress,
                            balance: (_k = (_j = response === null || response === void 0 ? void 0 : response.data) === null || _j === void 0 ? void 0 : _j.result) === null || _k === void 0 ? void 0 : _k[0].value
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
            var _q, _r;
            try {
                console.log({ contract_address, amount, slippage, wallet, decimal });
                const INFURA_URL = process.env.INFURA;
                const web3Provider = new ethers_1.ethers.providers.JsonRpcProvider(INFURA_URL);
                const ChainId = 1;
                const router = new smart_order_router_1.AlphaRouter({ chainId: ChainId, provider: web3Provider });
                const name0 = 'Wrapped Ether';
                const symbol0 = 'WETH';
                const decimal0 = 18;
                const address0 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
                const decimal1 = parseInt(decimal.toString());
                const address1 = contract_address;
                const WETH = new sdk_core_1.Token(ChainId, address0, decimal0, symbol0, name0);
                const ERC20 = new sdk_core_1.Token(ChainId, address1, decimal1);
                const wei = ethers_1.ethers.utils.parseUnits(amount.toString(), 18);
                const inputAmount = sdk_core_1.CurrencyAmount.fromRawAmount(WETH, jsbi_1.default.BigInt(wei));
                const options = {
                    recipient: wallet.address,
                    slippageTolerance: new sdk_core_1.Percent(slippage, 100),
                    deadline: Math.floor(Date.now() / 1000 + 1800),
                    type: smart_order_router_1.SwapType.SWAP_ROUTER_02,
                };
                const route = yield router.route(inputAmount, ERC20, sdk_core_1.TradeType.EXACT_INPUT, options);
                // get ether balance in wei
                const balanceWei = yield web3Provider.getBalance(wallet.address);
                // Convert Wei to Ether
                const balanceEther = ethers_1.ethers.utils.formatEther(balanceWei);
                if (parseInt(balanceEther) < amount) {
                    return {
                        status: false,
                        message: "you don't have enough ether"
                    };
                }
                //console.log(`qoute is ${route?.quote.toFixed(10)}`)
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
                // // approve v3 swap contract
                // const approveV3Contract = await contract0.connect(connectedWallet).approve(
                // V3_SWAP_CONTRACT_ADDRESS,
                // approveAmout
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
                    ether: balanceEther,
                    trade: tradeTransaction
                };
            }
            catch (err) {
                console.log("Error: ", err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.swapTokenToEth = ({ contract_address, amount, decimal, slippage, wallet, gas_fee }) => __awaiter(this, void 0, void 0, function* () {
            var _s, _t;
            try {
                const INFURA_URL = process.env.INFURA;
                const web3Provider = new ethers_1.ethers.providers.JsonRpcProvider(INFURA_URL);
                const ChainId = 1;
                const router = new smart_order_router_1.AlphaRouter({ chainId: ChainId, provider: web3Provider });
                const decimal0 = parseInt(decimal.toString());
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
                    //recipient: wallet.address,
                    recipient: wallet.address,
                    slippageTolerance: new sdk_core_1.Percent(slippage, 100),
                    deadline: Math.floor(Date.now() / 1000 + 1800),
                    type: smart_order_router_1.SwapType.SWAP_ROUTER_02,
                };
                const route = yield router.route(inputAmount, WETH, sdk_core_1.TradeType.EXACT_INPUT, options);
                //console.log(`qoute is ${route?.quote.toFixed(10)}`)
                const transaction = {
                    data: (_s = route === null || route === void 0 ? void 0 : route.methodParameters) === null || _s === void 0 ? void 0 : _s.calldata,
                    to: V3_SWAP_CONTRACT_ADDRESS,
                    value: ethers_1.BigNumber.from((_t = route === null || route === void 0 ? void 0 : route.methodParameters) === null || _t === void 0 ? void 0 : _t.value),
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
                if (parseInt(balanceEther) < amount) {
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
                    trade: tradeTransaction
                };
            }
            catch (err) {
                console.log(err);
                return { status: false, message: "unable to complete transaction" };
            }
        });
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
        //this.infuraProvider = new ethers.providers.JsonRpcProvider(INFURA_URL);
        if (!this.provider)
            throw new Error('No provider');
        this.poolContract = new ethers_1.ethers.Contract(exports.POOL_FACTORY_CONTRACT_ADDRESS, IUniswapV3Pool_json_1.default.abi, this.provider);
    }
}
const getDeadline = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentUnixTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    const buffer = 60 * 20; // 20 minutes buffer
    return currentUnixTimestamp + buffer;
});
const deriveAmounts = (amount, slippage) => {
    const amountIn = ethers_1.ethers.utils.parseEther(amount.toString());
    const slippageAdjustedAmount = amount * (1 - slippage / 100);
    const fee = amount * 0.01; // 1% fee
    const amountOut = ethers_1.ethers.utils.parseEther((slippageAdjustedAmount - fee).toString());
    return { amountIn, amountOut };
};
exports.default = TradeRepository;
// Currencies and Tokens
