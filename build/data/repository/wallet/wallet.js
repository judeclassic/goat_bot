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
exports.ANKR_PROVIDER_URL = void 0;
const web3_1 = __importDefault(require("web3"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __trade_1 = __importDefault(require("./__trade"));
//export const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
exports.ANKR_PROVIDER_URL = 'https://rpc.ankr.com/multichain/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
const ankr_js_1 = require("@ankr.com/ankr.js");
const ethers_1 = require("ethers");
const erc20_aba_1 = require("./erc20_aba");
//const YOUR_ANKR_PROVIDER_URL = 'http://127.0.0.1:8545'
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
const axios_1 = __importDefault(require("axios"));
const ETHERSCAN_API_KEY = 'XRSGJ71XPY5V7B76ICCSEPPVT9ZVFHXQTN';
class WalletRepository {
    constructor() {
        this.encryptToken = (data) => {
            return jsonwebtoken_1.default.sign(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.decryptToken = (data) => {
            return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
        };
        this.createWallet = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const account = this.provider.eth.accounts.create();
                const balance = yield this.ankrProvider.getAccountBalance({ walletAddress: account.address });
                return {
                    address: account.address,
                    private_key: this.encryptToken(account.privateKey),
                    balance: proximate((_b = (_a = balance.assets.find((value) => value.tokenSymbol === "eth")) === null || _a === void 0 ? void 0 : _a.balance) !== null && _b !== void 0 ? _b : '0'),
                    balance_in_dollar: proximate((_d = (_c = balance.assets.find((value) => value.tokenSymbol === "eth")) === null || _c === void 0 ? void 0 : _c.balanceUsd) !== null && _d !== void 0 ? _d : '0'),
                    others: []
                };
            }
            catch (err) {
                console.log("Error: ", err);
                return undefined;
            }
        });
        this.importWallet = (privateKey) => __awaiter(this, void 0, void 0, function* () {
            var _e, _f, _g, _h;
            try {
                const account = this.provider.eth.accounts.privateKeyToAccount(privateKey);
                const balance = yield this.ankrProvider.getAccountBalance({ walletAddress: account.address });
                return {
                    address: account.address,
                    private_key: this.encryptToken(account.privateKey),
                    balance: proximate((_f = (_e = balance.assets.find((value) => value.tokenSymbol === "eth")) === null || _e === void 0 ? void 0 : _e.balance) !== null && _f !== void 0 ? _f : '0'),
                    balance_in_dollar: proximate((_h = (_g = balance.assets.find((value) => value.tokenSymbol === "eth")) === null || _g === void 0 ? void 0 : _g.balanceUsd) !== null && _h !== void 0 ? _h : '0'),
                    others: []
                };
            }
            catch (err) {
                return undefined;
            }
        });
        this.getOtherTokens = (wallet) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield this.ankrProvider.getAccountBalance({ walletAddress: wallet.address, onlyWhitelisted: false });
                return tokens.assets.map((value) => ({
                    logo: value.thumbnail,
                    coin_name: value.tokenName,
                    coin_symbol: value.tokenSymbol,
                    constant_price: value.tokenPrice,
                    decimal: value.tokenDecimals,
                    contract_address: value.contractAddress,
                    balance: proximate(value.balance),
                    balance_in_dollar: proximate(value.balanceUsd)
                }));
            }
            catch (err) {
                return [];
            }
        });
        this.getWallet = (wallet) => __awaiter(this, void 0, void 0, function* () {
            var _j, _k, _l, _m;
            try {
                const balance = yield this.ankrProvider.getAccountBalance({ walletAddress: wallet.address });
                return {
                    address: wallet.address,
                    private_key: wallet.private_key,
                    balance: proximate((_k = (_j = balance.assets.find((value) => value.tokenSymbol === "ETH")) === null || _j === void 0 ? void 0 : _j.balance) !== null && _k !== void 0 ? _k : '0'),
                    balance_in_dollar: proximate((_m = (_l = balance.assets.find((value) => value.tokenSymbol === "ETH")) === null || _l === void 0 ? void 0 : _l.balanceUsd) !== null && _m !== void 0 ? _m : '0'),
                    others: balance.assets.map((value) => ({
                        logo: value.thumbnail,
                        coin_name: value.tokenName,
                        contract_address: value.contractAddress,
                        constant_price: value.tokenPrice,
                        decimal: value.tokenDecimals,
                        balance: value.balance,
                        balance_in_dollar: value.balanceUsd
                    }))
                };
            }
            catch (err) {
                return wallet;
            }
        });
        this.transferToken = ({ wallet, contract_address, reciever_address, amount }, callback) => __awaiter(this, void 0, void 0, function* () {
            var _o, _p, _q;
            try {
                console.log(1);
                const privateKey = this.decryptToken(wallet.private_key);
                const wallete = new ethers_1.ethers.Wallet(privateKey);
                console.log(2);
                const connectedWallet = wallete.connect(this.etherProvider);
                const erc20Contract = new ethers_1.ethers.Contract(contract_address, erc20_aba_1.ERC20ABI, this.etherProvider);
                const amountSent = ethers_1.ethers.utils.parseUnits(amount.toString(), 18);
                console.log(3);
                const txGasLimit = yield this.getGasPrices();
                const low = (_o = txGasLimit.gasPrices) === null || _o === void 0 ? void 0 : _o.low;
                const med = (_p = txGasLimit.gasPrices) === null || _p === void 0 ? void 0 : _p.average;
                const highGas = (_q = txGasLimit.gasPrices) === null || _q === void 0 ? void 0 : _q.high;
                console.log(5);
                const transferToken = yield erc20Contract.connect(connectedWallet).transfer(reciever_address.trim(), amountSent, {
                    gasPrice: ethers_1.ethers.utils.parseUnits(highGas, 'gwei'), // Set your preferred gas price
                    //gasLimit: 300000,
                });
                console.log(6);
                callback({
                    transactionHash: transferToken.hash,
                    wallet: wallet.address,
                    transactionType: 'transfer ERC20',
                    amount: amount
                });
                yield transferToken.wait();
                console.log(6);
                return { data: transferToken.hash };
            }
            catch (err) {
                console.log('error', err);
                return { error: 'Error unable process transaction' };
            }
        });
        this.transferEth = ({ wallet, reciever_address, amount }, callback) => __awaiter(this, void 0, void 0, function* () {
            var _r, _s, _t;
            try {
                console.log(1);
                const privateKey = this.decryptToken(wallet.private_key);
                const wallete = new ethers_1.ethers.Wallet(privateKey);
                const connectedWallet = wallete.connect(this.etherProvider);
                console.log(2);
                console.log('reciever', reciever_address);
                // const nonce = await this.etherProvider.getTransactionCount(wallet.address);
                const txGasLimit = yield this.getGasPrices();
                const low = (_r = txGasLimit.gasPrices) === null || _r === void 0 ? void 0 : _r.low;
                const med = (_s = txGasLimit.gasPrices) === null || _s === void 0 ? void 0 : _s.average;
                const highGas = (_t = txGasLimit.gasPrices) === null || _t === void 0 ? void 0 : _t.high;
                const sendEth = yield connectedWallet.sendTransaction({
                    to: reciever_address.trim(),
                    value: ethers_1.ethers.utils.parseEther(amount.toString()),
                    gasPrice: ethers_1.ethers.utils.parseUnits(highGas, 'gwei'),
                });
                console.log(3);
                callback({
                    transactionHash: sendEth.hash,
                    wallet: wallet.address,
                    transactionType: 'transfer Eth',
                    amount: amount
                });
                console.log(4);
                return { data: sendEth.hash };
            }
            catch (err) {
                console.log('Error', err);
                return { error: 'Error unable process transaction' };
            }
        });
        this.addTokensToWallet = (contract_address) => __awaiter(this, void 0, void 0, function* () {
            const abiResponse = yield this.tradeRepository.getABI(contract_address);
            if (!abiResponse.abi)
                return { error: abiResponse.error };
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
        this.provider = new web3_1.default(new web3_1.default.providers.HttpProvider(YOUR_ANKR_PROVIDER_URL));
        this.ankrProvider = new ankr_js_1.AnkrProvider(exports.ANKR_PROVIDER_URL);
        this.tradeRepository = new __trade_1.default();
        this.etherProvider = new ethers_1.ethers.providers.JsonRpcProvider(YOUR_ANKR_PROVIDER_URL);
    }
}
exports.default = WalletRepository;
const proximate = (value) => {
    return parseFloat(value).toPrecision(5);
};
