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
class TelegramService {
    constructor({ userModel, walletRepository, tradeRepository, encryptionRepository }) {
        this.changeLanguage = ({ telegram_id, langauge }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userModel.findOneAndUpdate({ telegram_id }, { default_language: langauge });
                if (!user)
                    return { status: false, message: 'unable to get current user' };
                return { status: true, user: Object.assign({}, user._doc) };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.userOpensChat = ({ telegram_id }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.getCurrentUser(telegram_id);
                if (!user)
                    return { status: false, message: 'unable to get current user' };
                const wallets = [];
                for (const element of user.wallets) {
                    const wallet = yield this.walletRepository.getWallet(element);
                    wallets.push(wallet);
                }
                return { status: true, user: Object.assign(Object.assign({}, user._doc), { wallets }) };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.userAddsWallet = ({ telegram_id }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.getCurrentUser(telegram_id);
                if (!user)
                    return { status: false, message: 'unable to get current user' };
                const wallets = [];
                if (user.wallets.length >= 3)
                    return { status: false, message: 'delete a wallet before adding one' };
                for (const element of user.wallets) {
                    const wallet = yield this.walletRepository.getWallet(element);
                    wallets.push(wallet);
                }
                const wallet = yield this.walletRepository.createWallet();
                if (!wallet)
                    return { status: false, message: 'error please send "/start" request again' };
                wallets.push(wallet);
                user.wallets = wallets;
                yield user.save();
                return { status: true, user: Object.assign(Object.assign({}, user._doc), { wallets }) };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.generateUserIDToken = ({ telegram_id, wallet_address }) => {
            try {
                const token = this.encryptionRepository.encryptToken({ telegram_id, wallet_address });
                return { status: true, token };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        };
        this.generateUserIDTokenAndWallet = ({ telegram_id, wallet_number }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.getCurrentUser(telegram_id);
                if (!user)
                    return { status: false, message: 'unable to get current user' };
                const wallet = user.wallets[wallet_number];
                if (!wallet)
                    return { status: false, message: 'unable to get current wallet' };
                const token = this.encryptionRepository.encryptToken({ telegram_id, wallet_address: wallet.address });
                return { status: true, token, wallet_address: wallet.address };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.userImportWallet = ({ telegram_id, private_key }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.getCurrentUser(telegram_id);
                if (!user)
                    return { status: false, message: 'unable to get current user' };
                if (!private_key)
                    return { status: false, message: 'invalid private key' };
                const wallets = [];
                for (const element of user.wallets) {
                    const wallet = yield this.walletRepository.getWallet(element);
                    wallets.push(wallet);
                }
                const wallet = yield this.walletRepository.importWallet(private_key);
                if (!wallet)
                    return { status: false, message: 'invalid private key' };
                wallets.push(wallet);
                user.wallets = wallets;
                const updatedUser = yield user.save();
                return { status: true, user: Object.assign(Object.assign({}, updatedUser), { wallets }) };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.userDeleteWallet = ({ telegram_id, wallet_number }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.getCurrentUser(telegram_id);
                if (!user)
                    return { status: false, message: 'unable to get current user' };
                const wallets = [];
                for (const element of user.wallets) {
                    if (user.wallets.indexOf(element) === wallet_number)
                        continue;
                    const wallet = yield this.walletRepository.getWallet(element);
                    console.log(element);
                    wallets.push(wallet);
                }
                user.wallets = wallets;
                const updatedUser = yield user.save();
                return { status: true, user: Object.assign(Object.assign({}, updatedUser), { wallets }) };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.getGeneralBalance = ({ telegram_id, wallet_number }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.getCurrentUser(telegram_id);
                if (!user)
                    return { status: false, message: 'unable to get current user' };
                const wallet = yield this.walletRepository.getWallet(user.wallets[wallet_number]);
                return { status: true, tokens: wallet.others };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.getCurrentUser = (telegram_id) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.userModel.findOne({ telegram_id });
            if (!user) {
                const wallets = [yield this.walletRepository.createWallet()];
                const user = yield this.userModel.create({ telegram_id, wallets, referal: {
                        referalCode: this.encryptionRepository.generateRandomStringCode(6),
                        totalReferrals: 0,
                        totalEarnings: 0,
                        claimableEarnings: 0,
                        totalGoatHeld: 0,
                    } });
                if (!user)
                    return { message: 'unable to create your account' };
                return { user };
            }
            if (!((_a = user === null || user === void 0 ? void 0 : user.referal) === null || _a === void 0 ? void 0 : _a.referalCode)) {
                user.referal = {
                    referalCode: this.encryptionRepository.generateRandomStringCode(6),
                    totalReferrals: 0,
                    totalEarnings: 0,
                    claimableEarnings: 0,
                    totalGoatHeld: 0,
                };
                yield user.save();
            }
            return { user };
        });
        this.claimReferral = ({ telegram_id }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.getCurrentUser(telegram_id);
                if (!user)
                    return { status: false, message: 'unable to get current user' };
                const wallets = [];
                for (const element of user.wallets) {
                    const wallet = yield this.walletRepository.getWallet(element);
                    wallets.push(wallet);
                }
                return { status: true, user: Object.assign(Object.assign({}, user._doc), { wallets }) };
            }
            catch (err) {
                return { status: false, message: 'error please send "/start" request again' };
            }
        });
        this.userModel = userModel;
        this.walletRepository = walletRepository;
        this.tradeRepository = tradeRepository;
        this.encryptionRepository = encryptionRepository;
    }
}
exports.default = TelegramService;
