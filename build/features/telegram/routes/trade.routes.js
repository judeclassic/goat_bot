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
exports.useTradeBotRoutes = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../../data/handler/template/message");
const INTEGRATION_WEB_HOST = 'https://goatbot.app';
const useTradeBotRoutes = ({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService }) => {
    bot.action('trade-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🟢 Swap', 'market-order-menu'),
                    telegraf_1.Markup.button.callback('🟠 Limit order', 'limit-order-menu')
                ],
                [telegraf_1.Markup.button.callback('📜 View transactions ', 'view-transaction-history')],
                [telegraf_1.Markup.button.callback('🔙 Back', 'menu'),]
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("Trading 📈: Dive into the financial oceans! Market Buy 🛍 & sell 🏷, Limit Buy 🛍 & sell 🏷, and keep a hawk's 👁 on your trades.", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('market-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('Buy', 'buy-market-order-menu')],
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.user.wallets.map((wallet, index) => {
                        var _a, _b;
                        const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                        const urlHost = getUrlForDomainTrade({ token: (_a = linkResponse.token) !== null && _a !== void 0 ? _a : "", wallet: (_b = wallet.address) !== null && _b !== void 0 ? _b : "", type: 'market_swap' });
                        console.log(urlHost);
                        return telegraf_1.Markup.button.webApp(` Wallet ${index + 1}`, urlHost);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("🐐 GoatBot | Swap Now 💸\n\n" +
                "Got profits or adjusting your assets? Easily swap your holdings with GoatBot.\n\n" +
                "🔄 How to Swap:\n" +
                "- Click /swap to start.\n" +
                "- Enter token contract address.\n" +
                "- Choose pair & amount.\n" +
                "- Confirm & execute.\n\n" +
                "Ready to swap? Click /swap now!\n", response.user.wallets, false);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('limit-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.user.wallets.map((wallet, index) => {
                        var _a, _b;
                        const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                        const urlHost = getUrlForDomainTrade({ token: (_a = linkResponse.token) !== null && _a !== void 0 ? _a : "", wallet: (_b = wallet.address) !== null && _b !== void 0 ? _b : "", type: 'limit_swap' });
                        return telegraf_1.Markup.button.webApp(` Wallet ${index + 1}`, urlHost);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("🐐 GoatBot | Limit Orders 📈\n\n" +
                "Ready for strategic moves? Place limit buy/sell orders with GoatBot for precise control over your crypto assets.\n\n" +
                "🔄 How to Set a Limit Order:\n" +
                "- Click /limit order to initiate.\n" +
                "- Enter token contract address.\n" +
                "- Specify pair, amount, and limit price.\n" +
                "- Confirm & set your limit swap order.\n\n" +
                "Set your limits! Click /limit order now.\n", response.user.wallets, false);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('view-transaction-history', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.user.wallets.map((wallet, index) => {
                        return telegraf_1.Markup.button.webApp(`Wallet ${index + 1}`, `https://etherscan.io/txs?a=${wallet.address}`);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities(" 📜 View Transaction History 🔍: Curious about your past maneuvers? Take a stroll down memory lane and review all your trade activities, beautifully documented and easy to understand", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useTradeBotRoutes = useTradeBotRoutes;
const getUrlForDomainTrade = ({ token, wallet, type }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}&wallet_address=${wallet}`;
    return url;
};
