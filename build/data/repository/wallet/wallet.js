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
exports.ANKR_PROVIDER_URL = exports.YOUR_ANKR_PROVIDER_URL = void 0;
const web3_1 = __importDefault(require("web3"));
const send_crypto_1 = __importDefault(require("send-crypto"));
const __trade_1 = __importDefault(require("./__trade"));
exports.YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
exports.ANKR_PROVIDER_URL = 'https://rpc.ankr.com/multichain/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
const ankr_js_1 = require("@ankr.com/ankr.js");
class WalletRepository {
    constructor() {
        this.createWallet = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const account = this.provider.eth.accounts.create();
                return {
                    address: account.address,
                    private_key: account.privateKey,
                    balance: "0",
                    balance_in_dollar: "0",
                    others: []
                };
            }
            catch (err) {
                return undefined;
            }
        });
        this.importWallet = (privateKey) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const account = this.provider.eth.accounts.privateKeyToAccount(privateKey);
                const balance = yield this.ankrProvider.getAccountBalance({ walletAddress: account.address });
                return {
                    address: account.address,
                    private_key: account.privateKey,
                    balance: proximate((_b = (_a = balance.assets.find((value) => value.tokenSymbol === "eth")) === null || _a === void 0 ? void 0 : _a.balance) !== null && _b !== void 0 ? _b : '0'),
                    balance_in_dollar: proximate((_d = (_c = balance.assets.find((value) => value.tokenSymbol === "eth")) === null || _c === void 0 ? void 0 : _c.balanceUsd) !== null && _d !== void 0 ? _d : '0'),
                    others: []
                };
            }
            catch (err) {
                return undefined;
            }
        });
        this.getOtherTokens = (wallet) => __awaiter(this, void 0, void 0, function* () {
            try {
                const account = this.provider.eth.accounts.privateKeyToAccount(wallet.private_key);
                const tokens = yield this.ankrProvider.getAccountBalance({ walletAddress: account.address });
                return tokens.assets.map((value) => ({
                    logo: value.thumbnail,
                    coin_name: value.tokenName,
                    coin_symbol: value.tokenSymbol,
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
            var _e, _f, _g, _h;
            try {
                const account = this.provider.eth.accounts.privateKeyToAccount(wallet.private_key);
                const balance = yield this.ankrProvider.getAccountBalance({ walletAddress: account.address });
                return {
                    address: account.address,
                    private_key: account.privateKey,
                    balance: proximate((_f = (_e = balance.assets.find((value) => value.tokenSymbol === "ETH")) === null || _e === void 0 ? void 0 : _e.balance) !== null && _f !== void 0 ? _f : '0'),
                    balance_in_dollar: proximate((_h = (_g = balance.assets.find((value) => value.tokenSymbol === "ETH")) === null || _g === void 0 ? void 0 : _g.balanceUsd) !== null && _h !== void 0 ? _h : '0'),
                    others: balance.assets.map((value) => ({
                        logo: value.thumbnail,
                        coin_name: value.tokenName,
                        contract_address: value.contractAddress,
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
        this.transferToken = ({ wallet, contract_address, reciever_address, amount }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const account = new send_crypto_1.default(wallet.private_key);
                const txHash = yield account.send(reciever_address, amount, {
                    type: "ERC20",
                    address: contract_address,
                })
                    .on("transactionHash", console.log)
                    .on("confirmation", console.log);
                return { data: txHash };
            }
            catch (err) {
                return { error: 'Error unable process transaction' };
            }
        });
        this.transferEth = ({ wallet, reciever_address, amount }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const account = new send_crypto_1.default(wallet.private_key);
                const txHash = yield account.send(reciever_address, amount, "ETH")
                    .on("transactionHash", console.log)
                    .on("confirmation", console.log);
                return { data: txHash };
            }
            catch (err) {
                return { error: 'Error unable process transaction' };
            }
        });
        this.addTokensToWallet = (contract_address) => __awaiter(this, void 0, void 0, function* () {
            const abiResponse = yield this.tradeRepository.getABI(contract_address);
            if (!abiResponse.abi)
                return { error: abiResponse.error };
        });
        this.provider = new web3_1.default(new web3_1.default.providers.HttpProvider(exports.YOUR_ANKR_PROVIDER_URL));
        this.ankrProvider = new ankr_js_1.AnkrProvider(exports.ANKR_PROVIDER_URL);
        this.tradeRepository = new __trade_1.default();
    }
}
exports.default = WalletRepository;
const proximate = (value) => {
    return parseFloat(value).toPrecision(5);
};
