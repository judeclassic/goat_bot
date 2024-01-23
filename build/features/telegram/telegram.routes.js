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
exports.useTelegramBot = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../data/handler/template/message");
const user_1 = require("../../data/repository/database/models/user");
const encryption_1 = __importDefault(require("../../data/repository/encryption"));
const __trade_1 = __importDefault(require("../../data/repository/wallet/__trade"));
const wallet_1 = __importDefault(require("../../data/repository/wallet/wallet"));
const bots_routes_1 = require("./routes/bots.routes");
const earn_routes_1 = require("./routes/earn.routes");
const setting_routes_1 = require("./routes/setting.routes");
const trade_routes_1 = require("./routes/trade.routes");
const wallet_routes_1 = require("./routes/wallet.routes");
const telegram_service_1 = __importDefault(require("./telegram.service"));
const useTelegramBot = () => {
    const YOUR_BOT_TOKEN = process.env.YOUR_BOT_TOKEN;
    const bot = new telegraf_1.Telegraf(YOUR_BOT_TOKEN);
    const walletRepository = new wallet_1.default();
    const tradeRepository = new __trade_1.default();
    const encryptionRepository = new encryption_1.default();
    const telegramService = new telegram_service_1.default({ userModel: user_1.UserModel, walletRepository, tradeRepository, encryptionRepository });
    bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const translate = new message_1.Translate();
        const keyboard = (translate) => {
            return telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: '💼 Wallet hub', tch: '💼 皮夾集線器' }), 'wallet-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '💹 Start trading', tch: '💹 開始交易' }), 'trade-menu'),
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🤖 Bot center', tch: '🤖 機器人中心' }), 'bots-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '💰 Earn rewards', tch: '💰 賺取獎勵' }), 'earn-menu')],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔧 Settings & tools', tch: '🔧 設定和工具' }), 'setting-menu')],
            ]);
        };
        if (!ctx.chat)
            return;
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return bot.telegram.sendMessage(telegram_id, response.message);
        translate.changeLanguage(response.user.default_language);
        const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
            en: "Elevate Your Crypto Trades with GOATBOT Greatest Of All Telegram Bots",
            tch: "使用所有 Telegram 機器人中最出色的 GOATBOT 提升您的加密貨幣交易",
        }), response.user.wallets, response.user.default_language);
        ctx.reply(text, Object.assign(Object.assign({}, keyboard(translate)), { entities, disable_web_page_preview: true }));
    }));
    bot.action('menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const translate = new message_1.Translate();
        const keyboard = (translate) => {
            return telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: '💼 Wallet hub', tch: '💼 皮夾集線器' }), 'wallet-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '💹 Start trading', tch: '💹 開始交易' }), 'trade-menu'),
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🤖 Bot center', tch: '🤖 機器人中心' }), 'bots-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '💰 Earn rewards', tch: '💰 賺取獎勵' }), 'earn-menu')],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔧 Settings & tools', tch: '🔧 設定和工具' }), 'setting-menu')],
            ]);
        };
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard(translate));
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard(translate));
        translate.changeLanguage(response.user.default_language);
        const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
            en: "Elevate Your Crypto Trades with GOATBOT Greatest Of All Telegram Bots",
            tch: "使用所有 Telegram 機器人中最出色的 GOATBOT 提升您的加密貨幣交易",
        }), response.user.wallets, response.user.default_language);
        ctx.reply(text, Object.assign(Object.assign({}, keyboard(translate)), { entities, disable_web_page_preview: true }));
    }));
    (0, wallet_routes_1.useWalletBotRoutes)({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService });
    (0, trade_routes_1.useTradeBotRoutes)({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService });
    (0, bots_routes_1.useBotsBotRoutes)({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService });
    (0, earn_routes_1.useEarnBotRoutes)({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService });
    (0, setting_routes_1.useSettingBotRoutes)({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService });
    bot.launch();
};
exports.useTelegramBot = useTelegramBot;
