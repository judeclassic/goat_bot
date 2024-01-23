"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.Language = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var Language;
(function (Language) {
    Language["english"] = "Engish";
    Language["traditional_chinese"] = "Traditional Chinese";
    Language["modern_chinese"] = "Modern Chinese";
})(Language = exports.Language || (exports.Language = {}));
const OtherWalletSchema = new mongoose_1.Schema({
    coin_name: {
        type: String,
    },
    contract_address: {
        type: String,
    },
});
const WalletSchema = new mongoose_1.Schema({
    private_key: {
        type: String,
    },
    address: {
        type: String,
    },
    seed_phrase: {
        type: String,
    },
    public_key: {
        type: String,
    },
    others: {
        type: [OtherWalletSchema],
        default: []
    }
});
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    telegram_id: {
        type: String,
    },
    wallets: [WalletSchema],
    referredUserCode: String,
    referal: {
        referalCode: String,
        totalReferrals: Number,
        totalEarnings: Number,
        claimableEarnings: Number,
        totalGoatHeld: Number,
    },
    default_language: {
        type: String,
        default: Language.english,
        enum: Object.values(Language),
    },
    passcode: {
        type: String,
    },
    previous_command: {
        type: String,
    }
});
UserSchema.plugin(mongoose_paginate_v2_1.default);
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
