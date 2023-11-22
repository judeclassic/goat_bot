import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete } from '../../../data/handler/template/message';
import EncryptionRepository from '../../../data/repository/encryption';
import TradeRepository from '../../../data/repository/wallet/__trade';
import WalletRepository from '../../../data/repository/wallet/wallet';
import TelegramService from '../telegram.service';

const INTEGRATION_WEB_HOST = 'https://goatbot.app';

export const useBotsBotRoutes = ({bot, walletRepository, tradeRepository, encryptionRepository, telegramService} : {
    bot: Telegraf,
    walletRepository: WalletRepository,
    tradeRepository: TradeRepository,
    encryptionRepository: EncryptionRepository;
    telegramService: TelegramService
}) => {
    
    bot.action('bots-menu', async (ctx) => {
        try {
            const keyboard = Markup.inlineKeyboard([
                [   Markup.button.callback('🎯 Sniper bot', 'activate-sniper-bot'),
                    Markup.button.callback('🚀 Frontrunner bot', 'activate-frontrunner-bot')],
                [   Markup.button.callback('🪞 Mirror bot', 'activate-mirror-bot'),
                    Markup.button.callback('📊 Bot stats', 'check-bot-performance')],
                [Markup.button.callback('🔙 Back', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, keyboard);

            const { text, entities } = MessageTemplete.generateWalletEntities("Bot Center 🤖: Automate like a pro! Sniper 🎯, frontrunner 🏃, mirror 🪞 bots & beyond.", response.user.wallets);
            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    bot.action( `activate-sniper-bot`, async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 Back', 'bots-menu')],
        ]);

        ctx.reply(MessageTemplete.defaultMessage(`This feature is coming soon`), initialKeyboard);
    });

    bot.action( `activate-frontrunner-bot`, async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 Back', 'bots-menu')],
        ]);

        ctx.reply(MessageTemplete.defaultMessage(`This feature is coming soon`), initialKeyboard);
    });

    bot.action( `activate-mirror-bot`, async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 Back', 'bots-menu')],
        ]);

        ctx.reply(MessageTemplete.defaultMessage(`This feature is coming soon`), initialKeyboard);
    });

    bot.action( `check-bot-performance`, async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 Back', 'bots-menu')],
        ]);

        ctx.reply(MessageTemplete.defaultMessage(`This feature is coming soon`), initialKeyboard);
    });
}