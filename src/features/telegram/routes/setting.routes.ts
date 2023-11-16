import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete } from '../../../data/handler/template/message';
import { UserModel } from '../../../data/repository/database/models/user';
import EncryptionRepository from '../../../data/repository/encryption';
import TradeRepository from '../../../data/repository/wallet/trade';
import WalletRepository from '../../../data/repository/wallet/wallet';
import TelegramService from '../telegram.service';

const INTEGRATION_WEB_HOST = 'https://goatbot.app';

export const useSettingBotRoutes = ({bot, walletRepository, tradeRepository, encryptionRepository, telegramService} : {
    bot: Telegraf,
    walletRepository: WalletRepository,
    tradeRepository: TradeRepository,
    encryptionRepository: EncryptionRepository;
    telegramService: TelegramService
}) => {
    
    bot.action('setting-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🗑️ Delete account', 'buy-coin-menu'),
            Markup.button.callback('🔐 Set password', 'sell-coin-menu'),
            Markup.button.callback('🔙 Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageTemplete.generateWalletEntities("Settings ⚙️: Tailor GoatBot in your style! Customize, tweak, and make it truly yours.", response.user.wallets)
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });
} 

