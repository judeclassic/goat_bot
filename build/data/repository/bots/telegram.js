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
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const user_1 = require("../database/models/user");
const token = '6010824016:AAE9Eohr5_lvNwD0fSTnbaDjjhkmrEhMBKM';
class TelegramBotRepository {
    constructor(userModel, walletRepository) {
        this.start = (callback) => {
            this.bot.onText(/\/start/, (msg) => __awaiter(this, void 0, void 0, function* () {
                const telegram_id = msg.chat.id;
                const user = yield user_1.UserModel.findOne({ telegram_id });
                if (!user) {
                    const wallets = [yield this.walletRepository.createWallet()];
                    const createdUser = yield this.userModel.create({ telegram_id, wallets });
                    if (!createdUser)
                        return { status: false, message: 'unable to create your account' };
                    callback({ msg, user: createdUser });
                    return;
                }
                if (!user)
                    return this.bot.sendMessage(telegram_id, "Error in retrieving account");
                callback({ msg, user });
            }));
        };
        this.on = (callback) => {
            this.bot.on('callback_query', (query) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const telegram_id = (_a = query.message) === null || _a === void 0 ? void 0 : _a.chat.id;
                const user = yield user_1.UserModel.findOne({ telegram_id });
                if (!user) {
                    const wallets = [yield this.walletRepository.createWallet()];
                    const createdUser = yield this.userModel.create({ telegram_id, wallets });
                    if (!createdUser)
                        return { status: false, message: 'unable to create your account' };
                    callback({ query, user: createdUser });
                    return;
                }
                if (!user)
                    return this.bot.sendMessage(telegram_id, "Error in retrieving account");
                callback({ query, user });
            }));
        };
        this.bot = new node_telegram_bot_api_1.default(token, { polling: true });
        this.walletRepository = walletRepository;
        this.userModel = userModel;
    }
}
exports.default = TelegramBotRepository;
