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
exports.useWalletBotRoutes = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../../data/handler/template/message");
const INTEGRATION_WEB_HOST = 'https://goatbot.app';
const useWalletBotRoutes = ({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService }) => {
    bot.action('wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                    telegraf_1.Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                    telegraf_1.Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('Transfer', 'send-token-menu'),
                    telegraf_1.Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
                ],
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('create-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            ctx.reply(message_1.MessageTemplete.defaultMessage("Click on 'Add New' to create a new wallet"), keyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('adding-new-wallet', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                    telegraf_1.Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                    telegraf_1.Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback('💼 Send Token', 'send-token-menu'),
                    telegraf_1.Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
                ],
                [telegraf_1.Markup.button.callback('🔙 Back to menu', 'menu')]
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userAddsWallet({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('import-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            ctx.reply(message_1.MessageTemplete.defaultMessage("Enter the wallet private key and send to add wallet"), modifiedKeyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('export-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu'),
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard);
            const { text, entities } = message_1.MessageTemplete.generateExportWalletEntities({ wallets: response.user.wallets });
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('remove-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("Select the wallet to remove", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`delete-wallet-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback('try again', `delete-wallet-${wallet_number + 1}`)],
                    [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
                ]);
                if (!ctx.chat)
                    return ctx.reply('unable to delete', initialKeyboard);
                const telegram_id = ctx.chat.id.toString();
                const response = yield telegramService.userOpensChat({ telegram_id });
                if (!response.user)
                    return ctx.reply(response.message, initialKeyboard);
                const keyboard = telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback(`Confirm Delete`, `delete-wallet-confirm-${wallet_number}`)],
                    [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
                ]);
                ctx.reply(message_1.MessageTemplete.defaultMessage(`Click on "Confirm Wallet ${wallet_number}" if you really want to remove this wallet ${(_b = (_a = response.user) === null || _a === void 0 ? void 0 : _a.wallets[wallet_number]) === null || _b === void 0 ? void 0 : _b.address}`), keyboard);
            }
            catch (err) {
                console.log(err);
            }
        }));
    });
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`delete-wallet-confirm-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback('try again', `delete-wallet-${wallet_number + 1}`)],
                    [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
                ]);
                if (!ctx.chat)
                    return ctx.reply('unable to confirm delete', initialKeyboard);
                const telegram_id = ctx.chat.id.toString();
                const response = yield telegramService.userDeleteWallet({ telegram_id, wallet_number });
                if (!response.user)
                    return ctx.reply(response.message, initialKeyboard);
                const keyboard = telegraf_1.Markup.inlineKeyboard([[
                        ...response.user.wallets.map((_wallet, index) => {
                            return telegraf_1.Markup.button.callback(`Wallet ${index + 1}`, `wallet-menu`);
                        })
                    ],
                    [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
                ]);
                const { text, entities } = message_1.MessageTemplete.generateWalletEntities("Select the wallet to remove", response.user.wallets);
                ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
            }
            catch (err) {
                console.log(err);
            }
        }));
    });
    bot.action('wallet-balance-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            ctx.reply(message_1.MessageTemplete.defaultMessage("Check wallet balance"), keyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`wallet-balance-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback('try again', `wallet-balance-${wallet_number + 1}`)],
                    [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],
                ]);
                if (!ctx.chat)
                    return ctx.reply('unable to delete', initialKeyboard);
                const telegram_id = ctx.chat.id.toString();
                const response = yield telegramService.getGeneralBalance({ telegram_id, wallet_number });
                if (!response.tokens)
                    return ctx.reply(response.message, initialKeyboard);
                const keyboard = telegraf_1.Markup.inlineKeyboard(
                // ...response.tokens.map((balance, index) => {
                //     return Markup.button.callback(`Wallet ${index+1}`, `wallet-balance-${index+1}`);
                // })],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')]);
                const { text, entities } = message_1.MessageTemplete.generateWalletBalanceEntities({ balances: response.tokens });
                ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
            }
            catch (err) {
                console.log(err);
            }
        }));
    });
    bot.action('send-token-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
                    ...response.user.wallets.map((wallet, index) => {
                        var _a;
                        const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                        const urlHost = getUrlForDomainWallet2({ token: (_a = linkResponse.token) !== null && _a !== void 0 ? _a : "", type: 'transfer_token', wallet: wallet.address });
                        console.log(urlHost);
                        return telegraf_1.Markup.button.webApp(` Wallet ${index + 1}`, urlHost);
                    })
                ],
                [telegraf_1.Markup.button.callback('🔙 Back', 'wallet-menu')],]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("Send token to another wallet address", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useWalletBotRoutes = useWalletBotRoutes;
const getUrlForDomainWallet2 = ({ token, wallet, type }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}&wallet_address=${wallet}`;
    return url;
};
const getUrlForDomainWallet = ({ token, type }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}`;
    return url;
};
