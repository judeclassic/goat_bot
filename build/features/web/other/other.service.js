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
const telegraf_1 = require("telegraf");
const message_1 = require("../../../data/handler/template/message");
class OtherService {
    constructor({ bot, userModel, tradeRepository, encryptionRepository, walletRepository, limitMarketModel }) {
        this.addReferralCode = ({ token, referral_code, }) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            if (user.referal.referalCode === referral_code) {
                return { errors: [{ message: 'you can not refer yourself' }] };
            }
            if (user.referredUserCode) {
                return { errors: [{ message: 'you have already referred this user' }] };
            }
            user.referredUserCode = referral_code;
            user.referal.totalEarnings += 1;
            user.referal.claimableEarnings += 1;
            const updatedUser = yield user.save();
            if (!updatedUser) {
                return { errors: [{ message: 'Unable to update user referal information' }] };
            }
            const userResponse = yield this._userModel.findOne({ "referal.referalCode": referral_code });
            if (!userResponse) {
                return { errors: [{ message: 'no user with this referal token' }] };
            }
            userResponse.referal.totalReferrals += 1;
            userResponse.referal.totalEarnings += 1;
            userResponse.referal.claimableEarnings += 1;
            const updatedUserResponse = yield userResponse.save();
            if (!updatedUserResponse) {
                return { errors: [{ message: 'no user with this referal token' }] };
            }
            try {
                const modifiedKeyboard = telegraf_1.Markup.inlineKeyboard([
                    telegraf_1.Markup.button.callback('🔙 Referal menu', 'refer-friends-and-earn'),
                    telegraf_1.Markup.button.callback('🔙 Back to menu', 'wallet-menu'),
                ]);
                this.bot.telegram.sendMessage(userResponse.telegram_id, message_1.MessageTemplete.defaultMessage("Success! You've earned 1 $GOAT by referring a friend or adding a referral code. Your friend gets 1 $GOAT too. Keep building your $GOAT balance!", user.default_language), modifiedKeyboard);
                this.bot.telegram.sendMessage(user.telegram_id, message_1.MessageTemplete.defaultMessage("You have entered the referral code successfully", user.default_language), modifiedKeyboard);
            }
            catch (_a) { }
            return { message: "updated successfully", };
        });
        this.bot = bot;
        this._userModel = userModel;
        this._encryptionRepository = encryptionRepository;
    }
}
exports.default = OtherService;
