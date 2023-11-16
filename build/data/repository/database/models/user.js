"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const OtherWalletSchema = new mongoose_1.Schema({
    coin_name: {
        type: String,
    },
    contract_address: {
        type: String,
    },
    balance: {
        type: Number,
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
    balance: {
        type: Number,
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
    referal: {
        referalCode: String,
        totalReferrals: Number,
        totalEarnings: Number,
        claimableEarnings: Number,
        totalGoatHeld: Number,
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
