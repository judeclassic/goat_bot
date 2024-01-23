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
            const translate = new message_1.Translate();
            const keyboard = (translate) => telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: '➕ Create new wallet', tch: '➕ 建立新錢包' }), 'create-wallet-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '⬇️ Import wallet', tch: '⬇️導入錢包' }), 'import-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '📤 Export wallet', tch: '📤 導出錢包' }), 'export-wallet-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '🗑️ Delete wallet', tch: '🗑️刪除錢包' }), 'remove-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '💼 Send Token', tch: '💼 發送令牌' }), 'send-token-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '💼 Wallet balance', tch: '💼 錢包餘額' }), 'wallet-balance-menu')
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back to menu', tch: '🔙 返回選單' }), 'menu')]
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard(translate));
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard(translate));
            translate.changeLanguage(response.user.default_language);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
                en: "Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances",
                tch: "錢包中心 📔：您的加密貨幣指揮中心！查看、建立、匯入、管理錢包、發送/接收和查看這些 💰 餘額"
            }), response.user.wallets, response.user.default_language);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard(translate)), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('create-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
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
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                en: "Click on 'Add New' to create a new wallet",
                tch: "點擊“新增”以建立新錢包"
            }), response.user.default_language), keyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('adding-new-wallet', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const keyboard = (translate) => telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: '➕ Create new wallet', tch: '➕ 建立新錢包' }), 'create-wallet-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '⬇️ Import wallet', tch: '⬇️導入錢包' }), 'import-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '📤 Export wallet', tch: '📤 導出錢包' }), 'export-wallet-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '🗑️ Delete wallet', tch: '🗑️刪除錢包' }), 'remove-wallet-menu')
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '💼 Send Token', tch: '💼 發送令牌' }), 'send-token-menu'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '💼 Wallet balance', tch: '💼 錢包餘額' }), 'wallet-balance-menu')
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back to menu', tch: '🔙 返回選單' }), 'menu')]
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard(translate));
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userAddsWallet({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard(translate));
            translate.changeLanguage(response.user.default_language);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
                en: 'Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances',
                tch: '錢包中心📔：您的加密貨幣指揮中心！ 查看、建立、匯入、管理錢包、發送/接收和查看這些 💰 餘額'
            }), response.user.wallets, response.user.default_language);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard(translate)), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('import-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
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
            const userResponse = yield telegramService.userAddsWallet({ telegram_id });
            if (!userResponse.user)
                return ctx.reply(userResponse.message, keyboard);
            translate.changeLanguage(userResponse.user.default_language);
            const modifiedKeyboard = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.webApp(translate.c({ en: 'Click here to import', tch: '點此導入' }), urlHost),
                telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu'),
            ]);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                en: "Enter the wallet private key and send to add wallet",
                tch: "輸入錢包私鑰並發送添加錢包",
            }), userResponse.user.default_language), modifiedKeyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('export-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu'),
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard);
            translate.changeLanguage(response.user.default_language);
            const { text, entities } = message_1.MessageTemplete.generateExportWalletEntities({ wallets: response.user.wallets }, response.user.default_language);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('remove-wallet-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: 'Buy', tch: '買' }), 'remove-wallet-menu')],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            translate.changeLanguage(response.user.default_language);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.user.wallets.map((_wallet, index) => {
                        return telegraf_1.Markup.button.callback(translate.c({ en: `Wallet ${index + 1}`, tch: `錢包 ${index + 1}` }), `delete-wallet-${index + 1}`);
                    })
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')],
            ]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({ en: "Select the wallet to remove", tch: "選擇要刪除的錢包" }), response.user.wallets, response.user.default_language);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`delete-wallet-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const translate = new message_1.Translate();
            try {
                const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback(translate.c({ en: 'try again', tch: '再試一次' }), `delete-wallet-${wallet_number + 1}`)],
                    [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')],
                ]);
                if (!ctx.chat)
                    return ctx.reply('unable to delete', initialKeyboard);
                const telegram_id = ctx.chat.id.toString();
                const response = yield telegramService.userOpensChat({ telegram_id });
                if (!response.user)
                    return ctx.reply(response.message, initialKeyboard);
                translate.changeLanguage(response.user.default_language);
                const keyboard = telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback(translate.c({ en: 'Confirm Delete', tch: '確認刪除' }), `delete-wallet-confirm-${wallet_number}`)],
                    [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')],
                ]);
                ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                    en: `Click on "Confirm Wallet ${wallet_number}" if you really want to remove this wallet ${(_b = (_a = response.user) === null || _a === void 0 ? void 0 : _a.wallets[wallet_number]) === null || _b === void 0 ? void 0 : _b.address}`,
                    tch: `點擊"確認錢包 ${wallet_number}" 如果你真的想刪除這個錢包 ${(_d = (_c = response.user) === null || _c === void 0 ? void 0 : _c.wallets[wallet_number]) === null || _d === void 0 ? void 0 : _d.address}`
                }), response.user.default_language), keyboard);
            }
            catch (err) {
                console.log(err);
            }
        }));
    });
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`delete-wallet-confirm-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const translate = new message_1.Translate();
                const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                    [telegraf_1.Markup.button.callback(translate.c({ en: 'try again', tch: '再試一次' }), `delete-wallet-${wallet_number + 1}`)],
                    [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')],
                ]);
                if (!ctx.chat)
                    return ctx.reply('unable to confirm delete', initialKeyboard);
                const telegram_id = ctx.chat.id.toString();
                const response = yield telegramService.userDeleteWallet({ telegram_id, wallet_number });
                if (!response.user)
                    return ctx.reply(response.message, initialKeyboard);
                translate.changeLanguage(response.user.default_language);
                const keyboard = telegraf_1.Markup.inlineKeyboard([[
                        ...response.user.wallets.map((_wallet, index) => {
                            return telegraf_1.Markup.button.callback(translate.c({ en: `Wallet ${index + 1}`, tch: `錢包 ${index + 1}` }), `wallet-menu`);
                        })
                    ],
                    [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')],
                ]);
                const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
                    en: '"Select the wallet to remove"',
                    tch: '選擇要刪除的錢包'
                }), response.user.wallets, response.user.default_language);
                ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
            }
            catch (err) {
                console.log(err);
            }
        }));
    });
    bot.action('wallet-balance-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
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
            translate.changeLanguage(response.user.default_language);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.user.wallets.map((_wallet, index) => {
                        return telegraf_1.Markup.button.callback(translate.c({ en: `Wallet ${index + 1}`, tch: `錢包 ${index + 1}` }), `wallet-balance-${index + 1}`);
                    })
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')],
            ]);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({ en: "Check wallet balance", tch: "查看錢包餘額" }), response.user.default_language), keyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    [1, 2, 3].forEach((data, wallet_number) => {
        bot.action(`wallet-balance-${wallet_number + 1}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const translate = new message_1.Translate();
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
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')]);
                const userResponse = yield telegramService.userOpensChat({ telegram_id });
                if (!userResponse.user)
                    return ctx.reply(userResponse.message, keyboard);
                translate.changeLanguage(userResponse.user.default_language);
                const { text, entities } = message_1.MessageTemplete.generateWalletBalanceEntities({ balances: response.tokens }, userResponse.user.default_language);
                ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
            }
            catch (err) {
                console.log(err);
            }
        }));
    });
    bot.action('send-token-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
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
            translate.changeLanguage(response.user.default_language);
            const keyboard = telegraf_1.Markup.inlineKeyboard([[
                    ...response.user.wallets.map((wallet, index) => {
                        var _a;
                        const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                        const urlHost = getUrlForDomainWallet2({ token: (_a = linkResponse.token) !== null && _a !== void 0 ? _a : "", type: 'transfer_token', wallet: wallet.address });
                        console.log(urlHost);
                        return telegraf_1.Markup.button.webApp(translate.c({ en: `Wallet ${index + 1}`, tch: `錢包 ${index + 1}` }), urlHost);
                    })
                ],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'wallet-menu')],]);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
                en: "Send token to another wallet address",
                tch: "將代幣發送到另一個錢包地址"
            }), response.user.wallets, response.user.default_language);
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
