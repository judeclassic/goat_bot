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
exports.useSettingBotRoutes = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../../data/handler/template/message");
const user_1 = require("../../../data/repository/database/models/user");
const useSettingBotRoutes = ({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService }) => {
    bot.action('setting-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const keyboard = (translate) => telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback(translate.c({ en: '🗑️ Delete account', tch: '🗑️刪除帳戶' }), 'delete-account'),
                telegraf_1.Markup.button.callback(translate.c({ en: '🔐 Set password', tch: '🔐設定密碼' }), 'set-password'),
                telegraf_1.Markup.button.callback(translate.c({ en: 'Change language', tch: '改變語言' }), 'change-language'),
                telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'menu'),
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard(translate));
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard(translate));
            translate.changeLanguage(response.user.default_language);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
                en: "Settings ⚙️: Tailor GoatBot in your style! Customize, tweak, and make it truly yours.",
                tch: "設定⚙️：按照您的風格自訂 GoatBot！ 客製化、調整並使其真正屬於您。"
            }), response.user.wallets, response.user.default_language);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard(translate)), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('change-language', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const keyboard = (translate) => telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback(translate.c({ en: 'English', tch: 'English' }), 'set-langauge-english'),
                telegraf_1.Markup.button.callback(translate.c({ en: 'Chinese', tch: 'Chinese' }), 'set-langauge-chinese'),
                telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'setting-menu'),
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard(translate));
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard(translate));
            translate.changeLanguage(response.user.default_language);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                en: "Select any of the options",
                tch: "選擇任意選項"
            }), response.user.default_language), keyboard(translate));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('set-langauge-english', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const keyboard = (translate) => telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback(translate.c({ en: 'English', tch: 'English' }), 'set-langauge-english'),
                telegraf_1.Markup.button.callback(translate.c({ en: 'Chinese', tch: 'Chinese' }), 'set-langauge-chinese')
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard(translate));
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.changeLanguage({ telegram_id, langauge: user_1.Language.english });
            if (!response.user)
                return ctx.reply(response.message, keyboard(translate));
            translate.changeLanguage(response.user.default_language);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                en: "Select any of the options",
                tch: "選擇任意選項"
            }), response.user.default_language), keyboard(translate));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('set-langauge-chinese', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const keyboard = (translate) => telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback(translate.c({ en: 'English', tch: 'English' }), 'set-langauge-english'),
                telegraf_1.Markup.button.callback(translate.c({ en: 'Chinese', tch: 'Chinese' }), 'set-langauge-chinese')
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard(translate));
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.changeLanguage({ telegram_id, langauge: user_1.Language.traditional_chinese });
            if (!response.user)
                return ctx.reply(response.message, keyboard(translate));
            translate.changeLanguage(response.user.default_language);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                en: "Select any of the options",
                tch: "選擇任意選項"
            }), response.user.default_language), keyboard(translate));
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useSettingBotRoutes = useSettingBotRoutes;
