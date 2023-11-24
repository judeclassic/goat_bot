"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitMarketModel = void 0;
const mongoose_1 = require("mongoose");
const LimitSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    marketType: {
        type: String,
        enum: ["buy", "sell"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
    },
    tokenInfo: {
        contractAddress: String,
        tokenName: String,
        tokenSymbol: String,
        decimal: Number
    },
    slippage: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.LimitMarketModel = (0, mongoose_1.model)("LimitMarket", LimitSchema);
