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
Object.defineProperty(exports, "__esModule", { value: true });
const encryption_1 = require("../../../data/repository/encryption");
class IntegrationService {
    constructor({ userModel, tradeRepository, encryptionRepository, walletRepository, limitMarketModel }) {
        this.getGasPrices = () => __awaiter(this, void 0, void 0, function* () {
            const gasPricesResponse = yield this._tradeRepository.getGasPrices();
            if (!gasPricesResponse.success || !gasPricesResponse.gasPrices) {
                return { errors: 'unable to get gas prices' };
            }
            return { data: gasPricesResponse.gasPrices };
        });
        this.getListOfTokensInWallet = ({ user_id, wallet_address }) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.findOne({ telegram_id: user_id });
            if (!user)
                return { errors: [{ message: 'unable to get user information' }] };
            const wallet = user.wallets[0];
            wallet.address = wallet_address;
            // const wallet = user.wallets.find((wallet) => wallet.address === wallet_address);
            // if (!wallet) return { errors: [{ message: 'unable to get wallet information' }]};
            const tokensResponse = yield this._tradeRepository.getListOfTokensInWallet({ wallet });
            if (!tokensResponse) {
                return { errors: [{ message: 'unable to get list of token' }] };
            }
            return { data: tokensResponse };
        });
        this.getCoinByContractAddress = ({ contract_address }) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._tradeRepository.getCoinByContractAddress({ contract_address });
            if (!response) {
                return { errors: [{ message: 'unable to place trade' }] };
            }
            return { response };
        });
        this.buyCoin = ({ token, wallet_address, contract_address, amount, slippage, gas_fee, decimal }) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            const wallet = user.wallets.find((wallet) => wallet.address === wallet_address);
            if (!wallet)
                return { errors: [{ message: 'unable to get wallet information' }] };
            const response = yield this._tradeRepository.swapEthToToken({ contract_address, amount, slippage, wallet, gas_fee, decimal });
            if (!response) {
                return { errors: [{ message: 'unable to place trade' }] };
            }
            return { response };
        });
        this.sellCoin = ({ token, wallet_address, contract_address, amount, slippage, decimal, gas_fee }) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            const wallet = user.wallets.find((wallet) => wallet.address === wallet_address);
            if (!wallet)
                return { errors: [{ message: 'unable to get wallet information' }] };
            const response = yield this._tradeRepository.swapTokenToEth({ contract_address, amount, slippage, wallet, decimal, gas_fee });
            if (!response) {
                return { errors: [{ message: 'unable to place trade' }] };
            }
            return { response };
        });
        this.limitBuy = ({ token, marketType, contractAddress, amount, slippage, walletAddress }) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id });
            console.log(user);
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            const wallet = user.wallets.find((wallet) => wallet.address === walletAddress);
            if (!wallet)
                return { error: [{ message: 'unable to get wallet information' }] };
            const newLimitBuy = new this._limitMarketModel({
                userId: decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id,
                marketType,
                contractAddress,
                amount,
                slippage,
                walletAddress
            });
            const saveNewLimitBuy = yield newLimitBuy.save();
            return { limitBuy: saveNewLimitBuy };
        });
        this.limitSell = ({ token, marketType, contractAddress, amount, slippage, walletAddress }) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            const wallet = user.wallets.find((wallet) => wallet.address === walletAddress);
            if (!wallet)
                return { errors: [{ message: 'unable to get wallet information' }] };
            const newLimitSell = new this._limitMarketModel({
                userId: decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id,
                marketType,
                contractAddress,
                amount,
                slippage,
                walletAddress
            });
            const saveNewLimitSell = yield newLimitSell.save();
            return { limitSell: saveNewLimitSell };
        });
        this.importWallet = ({ token, private_key }) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            if (user.wallets.find((wallet) => (wallet === null || wallet === void 0 ? void 0 : wallet.private_key) === private_key)) {
                return { errors: [{ message: 'This wallet is already imported' }] };
            }
            if (user.wallets.length > 2) {
                return { errors: [{ message: 'Remove one wallet to add this wallet' }] };
            }
            const wallet = yield this._walletRepository.importWallet(private_key);
            if (!wallet)
                return { errors: [{ message: 'invalid private key' }] };
            user.wallets.push(wallet);
            yield user.save();
            return { data: "Successfully updated" };
        });
        this.transferToken = ({ token, amount, contract_address, reciever_address }) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.wallet_address))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            const wallet = user.wallets.find((value) => value.address === (decoded === null || decoded === void 0 ? void 0 : decoded.wallet_address));
            if (!wallet)
                return { errors: [{ message: 'wallet not found' }] };
            const transaction = yield this._walletRepository.transferToken({ wallet, amount, contract_address, reciever_address });
            if (!transaction.data)
                return { errors: [{ message: (_a = transaction.error) !== null && _a !== void 0 ? _a : 'wallet not found' }] };
            return { data: transaction };
        });
        this.transferEth = ({ token, amount, reciever_address }) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.wallet_address))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            const wallet = user.wallets.find((value) => value.address === (decoded === null || decoded === void 0 ? void 0 : decoded.wallet_address));
            if (!wallet)
                return { errors: [{ message: 'wallet not found' }] };
            const transaction = yield this._walletRepository.transferEth({ wallet, amount, reciever_address });
            if (!transaction.data)
                return { errors: [{ message: (_b = transaction.error) !== null && _b !== void 0 ? _b : 'wallet not found' }] };
            return { data: transaction };
        });
        this.getBalance = (token) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Unable to load wallet' }] };
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.wallet_address))
                return { errors: [{ message: 'Unable to load wallet' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            const wallet = user.wallets.find((value) => value.address === (decoded === null || decoded === void 0 ? void 0 : decoded.wallet_address));
            if (!wallet)
                return { errors: [{ message: 'wallet not found' }] };
            const balances = yield this._tradeRepository.getListOfTokensInWallet({ wallet });
            return { data: balances };
        });
        this._userModel = userModel;
        this._tradeRepository = tradeRepository;
        this._encryptionRepository = encryptionRepository;
        this._walletRepository = walletRepository;
        this._limitMarketModel = limitMarketModel;
    }
}
exports.default = IntegrationService;
