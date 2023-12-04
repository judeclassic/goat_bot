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
                [telegraf_1.Markup.button.callback('🟢 Buy now', 'buy-market-order-menu'),
                    telegraf_1.Markup.button.callback('🔴 Sell now', 'sell-market-order-menu'),
                ],
                [telegraf_1.Markup.button.callback('🟡 Limit buy order', 'buy-limit-order-menu'),
                    telegraf_1.Markup.button.callback('🟠 Limit sell order', 'sell-limit-order-menu')
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
    bot.action('buy-market-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
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
                        const urlHost = getUrlForDomainTrade({ token: (_a = linkResponse.token) !== null && _a !== void 0 ? _a : "", wallet: (_b = wallet.address) !== null && _b !== void 0 ? _b : "", type: 'market_buy' });
                        console.log(urlHost);
                        return telegraf_1.Markup.button.webApp(` Wallet ${index + 1}`, urlHost);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("🟢 Buy Now 💸: Ready to expand your crypto portfolio? Dive in and acquire your desired cryptocurrency instantly with our smooth and straightforward buying process.", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('sell-market-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
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
                        const urlHost = getUrlForDomainTrade({ token: (_a = linkResponse.token) !== null && _a !== void 0 ? _a : "", wallet: (_b = wallet.address) !== null && _b !== void 0 ? _b : "", type: 'market_sell' });
                        return telegraf_1.Markup.button.webApp(` Wallet ${index + 1}`, urlHost);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("🔴 Sell Now 💸: Got profits? Or just reshuffling your assets? Easily liquidate your holdings at current market rates. Profit-taking has never been this seamless", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('buy-limit-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
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
            const tokenResponse = yield telegramService.generateUserIDToken({ telegram_id });
            if (!tokenResponse.token)
                return ctx.reply((_a = tokenResponse.message) !== null && _a !== void 0 ? _a : '', initialKeyboard);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.user.wallets.map((wallet, index) => {
                        var _a, _b;
                        const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                        const urlHost = getUrlForDomainTrade({ token: (_a = linkResponse.token) !== null && _a !== void 0 ? _a : "", wallet: (_b = wallet.address) !== null && _b !== void 0 ? _b : "", type: 'limit_buy' });
                        return telegraf_1.Markup.button.webApp(` Wallet ${index + 1}`, urlHost);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("🟡 Limit buy order 🔒: Secure your profits or limit losses! Decide on a selling price, and GoatBot will execute the trade when your set price is hit. Sleep easy, knowing you're in control.", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('sell-limit-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
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
                        const urlHost = getUrlForDomainTrade({ token: (_a = linkResponse.token) !== null && _a !== void 0 ? _a : "", wallet: (_b = wallet.address) !== null && _b !== void 0 ? _b : "", type: 'limit_sell' });
                        return telegraf_1.Markup.button.webApp(` Wallet ${index + 1}`, urlHost);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("🟠 Limit Sell Order 🔒: Secure your profits or limit losses! Decide on a selling price, and GoatBot will execute the trade when your set price is hit. Sleep easy, knowing you're in control.", response.user.wallets);
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
