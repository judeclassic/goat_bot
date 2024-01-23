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
exports.useEarnBotRoutes = void 0;
const telegraf_1 = require("telegraf");
const message_1 = require("../../../data/handler/template/message");
const INTEGRATION_WEB_HOST = 'https://goatbot.app';
const useEarnBotRoutes = ({ bot, telegramService }) => {
    bot.action('earn-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: '👫 Refer & earn', tch: '👫 推薦並賺取' }), 'refer-friends-and-earn')],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities(translate.c({
                en: "Earning 🌱: Grow your seeds into mighty oaks! Dive into referrals 🤝 & stake your claim",
                tch: "賺取🌱：將你的種子培育成強壯的橡樹！ 深入了解推薦🤝並提出您的主張"
            }), response.user.wallets, response.user.default_language);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('refer-friends-and-earn', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const intialKeyboard = telegraf_1.Markup.inlineKeyboard([
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
            const urlHost = getUrlForDomainEarn({ token: tokenResponse.token, type: 'add_refer_code' });
            console.log(urlHost);
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: '💼 Claim reward', tch: '💼 領取獎勵' }), "cliam_user_reward")],
                [telegraf_1.Markup.button.webApp(translate.c({ en: '📈 Enter ref code', tch: '📈 輸入參考代碼' }), urlHost)],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'earn-menu')],
            ]);
            ctx.reply(message_1.MessageEarnTemplate.generateReferalMessage(response.user, response.user.default_language), keyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('cliam_user_reward', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const translate = new message_1.Translate();
            const intialKeyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', intialKeyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.claimReferral({ telegram_id });
            const tokenResponse = telegramService.generateUserIDToken({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, intialKeyboard);
            if (!tokenResponse.token)
                return ctx.reply(tokenResponse.message, intialKeyboard);
            const urlHost = getUrlForDomainEarn({ token: tokenResponse.token, type: 'add_refer_code' });
            translate.changeLanguage(response.user.default_language);
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback(translate.c({ en: '💼 Claim reward', tch: '💼 領取獎勵' }), "cliam_user_reward")],
                [telegraf_1.Markup.button.webApp(translate.c({ en: '📈 Enter ref code', tch: '📈 輸入參考代碼' }), urlHost)],
                [telegraf_1.Markup.button.callback(translate.c({ en: '🔙 Back', tch: '🔙 返回' }), 'earn-menu')],
            ]);
            ctx.reply(message_1.MessageTemplete.defaultMessage(translate.c({ en: "Claim rewards is coming soon",
                tch: "領取獎勵即將到來"
            }), response.user.default_language), keyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useEarnBotRoutes = useEarnBotRoutes;
const getUrlForDomainEarn = ({ token, type }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}`;
    return url;
};
