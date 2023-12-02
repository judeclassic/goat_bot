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
exports.continueMarketCheck = exports.LimitBuySell = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../handler/template/message");
const limit_1 = require("../database/models/limit");
const user_1 = require("../database/models/user");
const trade_1 = __importDefault(require("./trade"));
const LimitBuySell = ({ tradeRepository, telegrambot }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const limitbuySells = yield limit_1.LimitMarketModel.find();
    for (const element of limitbuySells) {
        const limitbuySell = element;
        console.log(limitbuySell);
        const user = yield user_1.UserModel.findOne({ telegram_id: limitbuySell.userId });
        if (!user)
            continue;
        const wallet = user.wallets.find((wallet) => wallet.address === limitbuySell.walletAddress);
        if (!wallet)
            continue;
        if (limitbuySell.marketType == 'buy') {
            console.log(1);
            const currentToken = yield tradeRepository.getCoinByContractAddress({ contract_address: limitbuySell.tokenInfo.contractAddress });
            console.log('current price', (_a = currentToken.contract) === null || _a === void 0 ? void 0 : _a.constant_price);
            if (!((_b = currentToken.contract) === null || _b === void 0 ? void 0 : _b.constant_price)) {
                console.log("Unable to use token");
                continue;
            }
            console.log(2);
            if (parseFloat(currentToken.contract.constant_price) > limitbuySell.price) {
                continue;
            }
            console.log(3);
            const response = yield tradeRepository.swapEthToToken({
                wallet,
                amount: limitbuySell.amount,
                slippage: limitbuySell.slippage,
                tokenInfo: limitbuySell.tokenInfo,
                gas_fee: 1000000
            }, (data) => {
                telegrambot.telegram.sendMessage(user.telegram_id, message_1.MessageTemplete.buyNotificationMessage(user, data));
            });
            console.log(4);
            console.log('response', response);
            if (response.status) {
                yield limit_1.LimitMarketModel.findByIdAndRemove(limitbuySell._id);
            }
            console.log(5);
        }
        if (limitbuySell.marketType == 'sell') {
            console.log(1);
            const currentToken = yield tradeRepository.getCoinByContractAddress({ contract_address: limitbuySell.tokenInfo.contractAddress });
            console.log(2);
            if (!((_c = currentToken.contract) === null || _c === void 0 ? void 0 : _c.constant_price)) {
                console.log("Unable to use token");
                continue;
            }
            console.log(3);
            if (parseFloat(currentToken.contract.constant_price) < limitbuySell.price) {
                continue;
            }
            console.log(4);
            const response = yield tradeRepository.swapTokenToEth({
                wallet,
                amount: limitbuySell.amount,
                slippage: limitbuySell.slippage,
                tokenInfo: limitbuySell.tokenInfo,
                gas_fee: 1000000
            }, (data) => {
                telegrambot.telegram.sendMessage(user.telegram_id, message_1.MessageTemplete.buyNotificationMessage(user, data));
            });
            console.log(5);
            if (response.status) {
                yield limit_1.LimitMarketModel.findByIdAndRemove(limitbuySell._id);
            }
            console.log(6);
        }
    }
});
exports.LimitBuySell = LimitBuySell;
const continueMarketCheck = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const YOUR_BOT_TOKEN = process.env.YOUR_BOT_TOKEN;
        const tradeRepository = new trade_1.default();
        const telegrambot = new telegraf_1.Telegraf(YOUR_BOT_TOKEN);
        // setTimeout(() => {
        //     LimitBuySell({ tradeRepository, telegrambot })
        // }, 1000 * 2);
        setInterval(() => {
            (0, exports.LimitBuySell)({ tradeRepository, telegrambot });
        }, 1000 * 5);
    }
    catch (err) {
        console.log(err);
    }
});
exports.continueMarketCheck = continueMarketCheck;
