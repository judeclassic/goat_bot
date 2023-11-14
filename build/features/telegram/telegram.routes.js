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
const trade_1 = __importDefault(require("../../data/repository/wallet/trade"));
const wallet_1 = __importDefault(require("../../data/repository/wallet/wallet"));
const telegram_service_1 = __importDefault(require("./telegram.service"));
const INTEGRATION_WEB_HOST = 'https://goatbot.app';
const useTelegramBot = () => {
    const YOUR_BOT_TOKEN = process.env.YOUR_BOT_TOKEN;
    const bot = new telegraf_1.Telegraf(YOUR_BOT_TOKEN);
    const walletRepository = new wallet_1.default();
    const tradeRepository = new trade_1.default();
    const encryptionRepository = new encryption_1.default();
    const telegramService = new telegram_service_1.default({ userModel: user_1.UserModel, walletRepository, tradeRepository, encryptionRepository });
    bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
                telegraf_1.Markup.button.callback('💹 Start trading', 'trade-menu'),
            ],
            [telegraf_1.Markup.button.callback('🤖 Bot center', 'bots-menu'),
                telegraf_1.Markup.button.callback('💰 Earn rewards', 'earn-menu')],
            [telegraf_1.Markup.button.callback('🔧 Settings & tools', 'setting-menu')],
        ]);
        if (!ctx.chat)
            return;
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return bot.telegram.sendMessage(telegram_id, response.message);
        const { text, entities } = message_1.MessageTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
                telegraf_1.Markup.button.callback('💹 Start trading', 'trade-menu'),
            ],
            [telegraf_1.Markup.button.callback('🤖 Bot center', 'bots-menu'),
                telegraf_1.Markup.button.callback('💰 Earn rewards', 'earn-menu')],
            [telegraf_1.Markup.button.callback('🔧 Settings & tools', 'setting-menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard);
        const { text, entities } = message_1.MessageTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                telegraf_1.Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
            ],
            [telegraf_1.Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                telegraf_1.Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
            ],
            [telegraf_1.Markup.button.callback('Send Token', 'send-token-menu'),
                telegraf_1.Markup.button.callback('Send Etherium', 'send-etherium-menu'),
            ],
            [telegraf_1.Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')],
            [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard);
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('create-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.callback('Add New', 'adding-new-wallet'),
            telegraf_1.Markup.button.callback('🔙 Back 🔄', 'wallet-menu'),
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard);
        ctx.reply(message_1.MessageWalletTemplete.createANewWallet(), keyboard);
    }));
    bot.action('adding-new-wallet', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                telegraf_1.Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
            ],
            [telegraf_1.Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                telegraf_1.Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
            ],
            [telegraf_1.Markup.button.callback('💼 Send Token', 'send-token-menu'),
                telegraf_1.Markup.button.callback('💼 Send Etherium', 'send-etherium-menu'),
            ],
            [telegraf_1.Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')],
            [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')]
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userAddsWallet({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard);
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('import-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.callback('Try again', 'import-new-wallet'),
            telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu'),
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.generateUserIDToken({ telegram_id });
        if (!response.token)
            return ctx.reply(response.message, keyboard);
        const urlHost = getUrlForDomainWallet({ token: response.token, type: 'import_wallet' });
        const modifiedKeyboard = telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.webApp('Click here to import', urlHost),
            telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu'),
        ]);
        ctx.reply(message_1.MessageWalletTemplete.importAWallet(), modifiedKeyboard);
    }));
    bot.action('export-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu'),
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard);
        const { text, entities } = message_1.MessageWalletTemplete.generateExportWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('remove-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('Buy', 'remove-wallet-menu')],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', initialKeyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, initialKeyboard);
        const keyboard = telegraf_1.Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return telegraf_1.Markup.button.callback(`Wallet ${index + 1}`, `delete-wallet-${index + 1}`);
                })
            ],
            [telegraf_1.Markup.button.callback('🔙 Back 🔄', 'wallet-menu')],
        ]);
        const { text, entities } = message_1.MessageWalletTemplete.generateExportWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`delete-wallet-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('try again', `delete-wallet-${wallet_number + 1}`)],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to delete', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userDeleteWallet({ telegram_id, wallet_number });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.user.wallets.map((_wallet, index) => {
                        return telegraf_1.Markup.button.callback(`Wallet ${index + 1}`, `delete-wallet-${index + 1}`);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);
            ctx.reply(message_1.MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
        }));
    });
    bot.action('wallet-balance-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('Buy', 'remove-wallet-menu')],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', initialKeyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, initialKeyboard);
        const keyboard = telegraf_1.Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return telegraf_1.Markup.button.callback(`Wallet ${index + 1}`, `wallet-balance-${index + 1}`);
                })
            ],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);
        ctx.reply(message_1.MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`wallet-balance-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('try again', `wallet-balance-${wallet_number + 1}`)],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to delete', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.getGeneralBalance({ telegram_id, wallet_number });
            if (!response.balances)
                return ctx.reply(response.message, initialKeyboard);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.balances.map((balance, index) => {
                        return telegraf_1.Markup.button.callback(`Wallet ${index + 1}`, `wallet-balance-${index + 1}`);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);
            const { text, entities } = message_1.MessageWalletTemplete.generateWalletBalanceEntities({ balances: response.balances });
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }));
    });
    bot.action('send-token-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('Try again', 'send-from-wallet')],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', initialKeyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, initialKeyboard);
        const keyboard = telegraf_1.Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return telegraf_1.Markup.button.callback(` Wallet ${index + 1}`, `send-token-${index + 1}`);
                })
            ],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`send-token-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('Try again', `send-token-${wallet_number + 1}`)],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to delete', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.generateUserIDTokenAndWallet({ telegram_id, wallet_number });
            if (!response.token)
                return ctx.reply(response.message, initialKeyboard);
            const urlHost = getUrlForDomainWallet({ token: response.token, type: 'transfer_token' });
            const modifiedKeyboard = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.webApp('Click here to send', urlHost),
                telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu'),
            ]);
            ctx.reply(message_1.MessageWalletTemplete.sendToken(), modifiedKeyboard);
        }));
    });
    bot.action('send-etherium-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('Try again', 'send-etherium-menu')],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', initialKeyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, initialKeyboard);
        const keyboard = telegraf_1.Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return telegraf_1.Markup.button.callback(`Wallet ${index + 1}`, `send-etherium-${index + 1}`);
                })
            ],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`send-etherium-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('try again', `send-coin-${wallet_number + 1}`)],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to delete', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.generateUserIDToken({ telegram_id });
            if (!response.token)
                return ctx.reply(response.message, initialKeyboard);
            const urlHost = getUrlForDomainWallet({ token: response.token, type: 'transfer_etherium' });
            const modifiedKeyboard = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.webApp('Click here to send', urlHost),
                telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu'),
            ]);
            ctx.reply(message_1.MessageWalletTemplete.sendEtherium(), modifiedKeyboard);
        }));
    });
    bot.action('trade-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('buy-market-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('Buy', 'buy-market-order-menu')],
            [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', initialKeyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, initialKeyboard);
        const keyboard = telegraf_1.Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return telegraf_1.Markup.button.callback(`Wallet ${index + 1}`, `buy-market-order-${index + 1}`);
                })
            ],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    [1, 2, 3].forEach((index, wallet_number) => {
        bot.action(`buy-market-order-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('try again', `send-coin-${wallet_number + 1}`)],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);
            ``;
            if (!ctx.chat)
                return ctx.reply('unable to delete', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.generateUserIDTokenAndWallet({ telegram_id, wallet_number });
            if (!response.token)
                return ctx.reply(response.message, initialKeyboard);
            const urlHost = getUrlForDomainTrade({ token: response.token, wallet: response.wallet_address, type: 'market_buy' });
            const modifiedKeyboard = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.webApp('Click here to proceed', urlHost),
                telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')
            ]);
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click here to proceed your buying token"), modifiedKeyboard);
        }));
    });
    bot.action('sell-market-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', initialKeyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, initialKeyboard);
        const keyboard = telegraf_1.Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return telegraf_1.Markup.button.callback(`Wallet ${index + 1}`, `sell-market-order-${index + 1}`);
                })
            ],
            [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')]
        ]);
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`sell-market-order-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('try again', `send-coin-${wallet_number + 1}`)],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')]
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to delete', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.generateUserIDTokenAndWallet({ telegram_id, wallet_number });
            if (!response.token)
                return ctx.reply(response.message, initialKeyboard);
            const urlHost = getUrlForDomainTrade({ token: response.token, wallet: response.wallet_address, type: 'market_sell' });
            console.log(urlHost);
            const modifiedKeyboard = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.webApp('Click here to send', urlHost),
                telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')
            ]);
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click here to proceed your buying"), modifiedKeyboard);
        }));
    });
    bot.action('buy-limit-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
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
        const urlHost = getUrlForDomainTrade({ token: tokenResponse.token, wallet: response.user.wallets[0].address, type: 'limit_buy' });
        console.log(urlHost);
        const keyboard = telegraf_1.Markup.inlineKeyboard([[
                ...response.user.wallets.map((wallet, index) => {
                    return telegraf_1.Markup.button.webApp(`Wallet ${index + 1}`, `${getUrlForDomainTrade({ token: tokenResponse.token, wallet: wallet.address, type: 'limit_buy' })}`);
                })
            ],
            [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],
        ]);
        ctx.reply(message_1.MessageTradeTemplete.limitBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    }));
    bot.action('sell-limit-order-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', initialKeyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, initialKeyboard);
        const tokenResponse = yield telegramService.generateUserIDToken({ telegram_id });
        if (!tokenResponse.token)
            return ctx.reply((_b = tokenResponse.message) !== null && _b !== void 0 ? _b : '', initialKeyboard);
        const urlHost = getUrlForDomainTrade({ token: tokenResponse.token, wallet: response.user.wallets[0].address, type: 'limit_sell' });
        const keyboard = telegraf_1.Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return telegraf_1.Markup.button.webApp(`Wallet ${index + 1}`, `${urlHost}`);
                })
            ],
            [telegraf_1.Markup.button.callback('🔙 Back', 'trade-menu')],
        ]);
        ctx.reply(message_1.MessageTradeTemplete.limitSellWalletAddress({ wallets: response.user.wallets }), keyboard);
    }));
    bot.action('view-transaction-history', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
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
        ctx.reply(message_1.MessageTradeTemplete.viewTransactionHistory({ wallets: response.user.wallets }), keyboard);
    }));
    bot.action('bots-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('🎯 Activate sniper bot', 'activate-sniper-bot')],
            [telegraf_1.Markup.button.callback('🚀 Activate frontrunner bot', 'activate-frontrunner-bot')],
            [telegraf_1.Markup.button.callback('🪞 Activate mirror bot', 'activate-mirror-bot')],
            [telegraf_1.Markup.button.callback('📊 Check bot stats', 'check-bot-performance')],
            [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard);
        const { text, entities } = message_1.MessageTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('earn-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            // Markup.button.callback('📈 Stake & earn', 'participate-in-staking'),
            telegraf_1.Markup.button.callback('👫 Refer & earn', 'refer-friends-and-earn'),
            // Markup.button.callback('📘 View earnings', 'view-earnings-history'),
            telegraf_1.Markup.button.callback('🔙 Back', 'menu'),
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard);
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('refer-friends-and-earn', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const intialKeyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('📈 Claim', '')],
            [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', intialKeyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        const tokenResponse = yield telegramService.generateUserIDToken({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, intialKeyboard);
        if (!tokenResponse.token)
            return ctx.reply(tokenResponse.message, intialKeyboard);
        const urlHost = getUrlForDomainWallet({ token: tokenResponse.token, type: 'transfer_token' });
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.webApp('📈 Claim', urlHost)],
            [telegraf_1.Markup.button.webApp('📈 Enter referral', urlHost)],
            [telegraf_1.Markup.button.callback('🔙 Back', 'earn-menu')],
        ]);
        const { text, entities } = message_1.MessageEarnTemplate.generateReferalMessage({ user: response.user });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
    bot.action('setting-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const keyboard = telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.callback('🗑️ Delete account', 'buy-coin-menu'),
            telegraf_1.Markup.button.callback('🔐 Set password', 'sell-coin-menu'),
            telegraf_1.Markup.button.callback('🔙 Back', 'menu'),
        ]);
        if (!ctx.chat)
            return ctx.reply('unable to process message', keyboard);
        const telegram_id = ctx.chat.id.toString();
        const response = yield telegramService.userOpensChat({ telegram_id });
        if (!response.user)
            return ctx.reply(response.message, keyboard);
        const { text, entities } = message_1.MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets });
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        ctx.reply(message_1.MessageTemplete.welcome(), keyboard);
    }));
    bot.launch();
};
exports.useTelegramBot = useTelegramBot;
const getUrlForDomainTrade = ({ token, wallet, type }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}&wallet_address=${wallet}`;
    return url;
};
const getUrlForDomainWallet = ({ token, type }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}`;
    return url;
};
