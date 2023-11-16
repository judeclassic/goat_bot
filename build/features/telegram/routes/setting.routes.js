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
const INTEGRATION_WEB_HOST = 'https://goatbot.app';
const useSettingBotRoutes = ({ bot, walletRepository, tradeRepository, encryptionRepository, telegramService }) => {
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
        const { text, entities } = message_1.MessageTemplete.generateWalletEntities("Settings ⚙️: Tailor GoatBot in your style! Customize, tweak, and make it truly yours.", response.user.wallets);
        ctx.reply(text, Object.assign(Object.assign({}, keyboard), { entities, disable_web_page_preview: true }));
    }));
};
exports.useSettingBotRoutes = useSettingBotRoutes;
