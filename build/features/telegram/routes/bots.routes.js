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
exports.useBotsBotRoutes = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../../data/handler/template/message");
const INTEGRATION_WEB_HOST = 'https://goatbot.app';
const useBotsBotRoutes = ({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService }) => {
    bot.action('bots-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const keyboard = (translate) => telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: '🎯 Sniper bot', tch: '🎯 狙擊機器人' }), 'activate-sniper-bot'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '🚀 Frontrunner bot', tch: '🚀 領跑者機器人' }), 'activate-frontrunner-bot')],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🪞 Mirror bot', tch: '🪞 鏡像機器人' }), 'activate-mirror-bot'),
                    telegraf_1.Markup.button.callback(translate.c({ en: '📊 Bot stats', tch: '📊 機器人統計數據' }), 'check-bot-performance')],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply(translate.c({ en: 'unable to process message', tch: '無法處理訊息' }), keyboard(translate));
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard(translate));
            translate.changeLanguage(response.user.default_language);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
                en: '"Bot Center 🤖: Automate like a pro! Sniper 🎯, frontrunner 🏃, mirror 🪞 bots & beyond."',
                tch: '機器人中心🤖：像專業人士一樣自動化！ 狙擊手🎯、領先者🏃、鏡子🪞機器人等等。'
            }), response.user.wallets, response.user.default_language);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action(`activate-sniper-bot`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back', 'bots-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.claimReferral({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            translate.changeLanguage(response.user.default_language);
            ctx.reply(message_1.MessageTemplete.defaultMessage(`This feature is coming soon`, response.user.default_language), initialKeyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action(`activate-frontrunner-bot`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back', 'bots-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.claimReferral({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            translate.changeLanguage(response.user.default_language);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                en: 'This feature is coming soon',
                tch: '此功能即將推出'
            }), response.user.default_language), initialKeyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action(`activate-mirror-bot`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back', 'bots-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.claimReferral({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            translate.changeLanguage(response.user.default_language);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                en: 'This feature is coming soon',
                tch: '此功能即將推出'
            }), response.user.default_language), initialKeyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action(`check-bot-performance`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const initialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back', 'bots-menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', initialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.claimReferral({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, initialKeyboard);
            translate.changeLanguage(response.user.default_language);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({
                en: 'This feature is coming soon',
                tch: '此功能即將推出'
            }), response.user.default_language), initialKeyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useBotsBotRoutes = useBotsBotRoutes;
