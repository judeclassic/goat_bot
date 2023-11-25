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
class OtherService {
    constructor({ userModel, tradeRepository, encryptionRepository, walletRepository, limitMarketModel }) {
        this.addReferralCode = ({ token, referral_code, }) => __awaiter(this, void 0, void 0, function* () {
            const decoded = this._encryptionRepository.decryptToken(token, encryption_1.TokenType.accessToken);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id))
                return { errors: [{ message: 'Invalid request' }] };
            const user = yield this._userModel.findOne({ telegram_id: decoded === null || decoded === void 0 ? void 0 : decoded.telegram_id });
            if (!user)
                return { errors: [{ message: 'user not found' }] };
            if (user.isReferralSent) {
                return { errors: [{ message: 'referral has been sent to user' }] };
            }
            const userResponse = this._userModel.find({ "referal.referalCode": referral_code }, {
                "referal.totalReferrals": { $inc: 1 },
                "referal.totalEarnings": { $inc: 1 },
                "referal.claimableEarnings": { $inc: 1 },
            });
            if (!userResponse) {
                return { errors: [{ message: 'unable to place trade' }] };
            }
            return { userResponse };
        });
        this._userModel = userModel;
        this._encryptionRepository = encryptionRepository;
    }
}
exports.default = OtherService;
