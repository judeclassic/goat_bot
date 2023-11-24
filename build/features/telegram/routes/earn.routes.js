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
const useEarnBotRoutes = ({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService }) => {
    bot.action('earn-menu', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('👫 Refer & earn', 'refer-friends-and-earn')],
                [telegraf_1.Markup.button.callback('🔙 Back', 'menu')],
            ]);
            if (!ctx.chat)
                return ctx.reply('unable to process message', keyboard);
            const telegram_id = ctx.chat.id.toString();
            const response = yield telegramService.userOpensChat({ telegram_id });
            if (!response.user)
                return ctx.reply(response.message, keyboard);
            const { text, entities } = message_1.MessageTemplete.generateWalletEntities("Earning 🌱: Grow your seeds into mighty oaks! Dive into referrals 🤝 & stake your claim", response.user.wallets);
            ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    bot.action('refer-friends-and-earn', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            const urlHost = getUrlForDomainWallet({ token: tokenResponse.token, type: 'transfer_token' });
            const keyboard = telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.webApp('💼 Claim reward', urlHost)],
                [telegraf_1.Markup.button.webApp('📈 Enter ref code', urlHost)],
                [telegraf_1.Markup.button.callback('🔙 Back', 'earn-menu')],
            ]);
            ctx.reply(message_1.MessageEarnTemplate.generateReferalMessage(response), keyboard);
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.useEarnBotRoutes = useEarnBotRoutes;
const getUrlForDomainWallet = ({ token, type }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}`;
    return url;
};
