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
const web3_1 = __importDefault(require("web3"));
const send_crypto_1 = __importDefault(require("send-crypto"));
const trade_1 = __importDefault(require("./trade"));
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
class WalletRepository {
    constructor() {
        this.createWallet = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const account = this.provider.eth.accounts.create();
                return {
                    address: account.address,
                    private_key: account.privateKey,
                    balance: 0,
                    others: []
                };
            }
            catch (err) {
                return undefined;
            }
        });
        this.importWallet = (privateKey) => __awaiter(this, void 0, void 0, function* () {
            try {
                const account = this.provider.eth.accounts.privateKeyToAccount(privateKey);
                return {
                    address: account.address,
                    private_key: account.privateKey,
                    balance: parseFloat((yield this.provider.eth.getBalance(account.address)).toString()),
                    others: []
                };
            }
            catch (err) {
                return undefined;
            }
        });
        this.getWallet = (wallet) => __awaiter(this, void 0, void 0, function* () {
            try {
                const account = this.provider.eth.accounts.privateKeyToAccount(wallet.private_key);
                return {
                    address: account.address,
                    private_key: account.privateKey,
                    balance: parseFloat((yield this.provider.eth.getBalance(account.address)).toString()),
                    others: wallet.others.map((wallet) => wallet)
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
        this.provider = new web3_1.default(new web3_1.default.providers.HttpProvider(YOUR_ANKR_PROVIDER_URL));
        this.tradeRepository = new trade_1.default();
    }
}
exports.default = WalletRepository;
