import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete } from '../../data/handler/template/message';
import { UserModel } from '../../data/repository/database/models/user';
import EncryptionRepository from '../../data/repository/encryption';
import TradeRepository from '../../data/repository/wallet/__trade';
import WalletRepository from '../../data/repository/wallet/wallet';
import { useBotsBotRoutes } from './routes/bots.routes';
import { useEarnBotRoutes } from './routes/earn.routes';
import { useSettingBotRoutes } from './routes/setting.routes';
import { useTradeBotRoutes } from './routes/trade.routes';
import { useWalletBotRoutes } from './routes/wallet.routes';
import TelegramService from './telegram.service';

export const useTelegramBot = () => {
    const YOUR_BOT_TOKEN = process.env.YOUR_BOT_TOKEN!;

    const bot = new Telegraf(YOUR_BOT_TOKEN);
    const walletRepository = new WalletRepository();
    const tradeRepository = new TradeRepository();
    const encryptionRepository = new EncryptionRepository();
    const telegramService = new TelegramService({ userModel: UserModel, walletRepository, tradeRepository, encryptionRepository });
    
    bot.start(async (ctx) => {
        // try {ctx.deleteMessage()} catch {}
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
                Markup.button.callback('💹 Start trading', 'trade-menu'),
            ],
            [   Markup.button.callback('🤖 Bot center', 'bots-menu'),
                Markup.button.callback('💰 Earn rewards', 'earn-menu')],
            [Markup.button.callback('🔧 Settings & tools', 'setting-menu')],
        ]);

        if (!ctx.chat) return;
        const telegram_id = ctx.chat.id.toString();

        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return bot.telegram.sendMessage(telegram_id, response.message);

        const { text, entities } = MessageTemplete.generateWalletEntities("Elevate Your Crypto Trades with GOATBOT Greatest Of All Telegram Bots", response.user.wallets)
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });

    bot.action('menu', async (ctx) => {
        // try {ctx.deleteMessage()} catch {}
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
                Markup.button.callback('💹 Start trading', 'trade-menu'),
            ],
            [   Markup.button.callback('🤖 Bot center', 'bots-menu'),
                Markup.button.callback('💰 Earn rewards', 'earn-menu')],
            [Markup.button.callback('🔧 Settings & tools', 'setting-menu')],
        ]);
        
        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);
        ctx.deleteMessage()

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageTemplete.generateWalletEntities("Elevate Your Crypto Trades with GOATBOT Greatest Of All Telegram Bots", response.user.wallets)
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });

    useWalletBotRoutes({bot, walletRepository, tradeRepository, encryptionRepository, telegramService});

    useTradeBotRoutes({bot, walletRepository, tradeRepository, encryptionRepository, telegramService});

    useBotsBotRoutes({bot, walletRepository, tradeRepository, encryptionRepository, telegramService});

    useEarnBotRoutes({bot, walletRepository, tradeRepository, encryptionRepository, telegramService});

    useSettingBotRoutes({bot, walletRepository, tradeRepository, encryptionRepository, telegramService});

    bot.launch();
}
