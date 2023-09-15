import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete, MessageWalletTemplete, MessageTradeTemplete } from '../../data/handler/template/message';
import { UserModel } from '../../data/repository/database/models/user';
import WalletRepository from '../../data/repository/wallet/wallet';
import TelegramService from './telegram.service';
const YOUR_BOT_TOKEN = '6010824016:AAE9Eohr5_lvNwD0fSTnbaDjjhkmrEhMBKM';
const bot = new Telegraf(YOUR_BOT_TOKEN);

export const useTelegramBot = () => {
    const walletRepository = new WalletRepository();
    const telegramService = new TelegramService({ userModel: UserModel, walletRepository });
    
    bot.start(async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Wallet', 'wallet-menu'),
            Markup.button.callback('Trade', 'trade-menu'),
            Markup.button.callback('Bots', 'bots-menu'),
            Markup.button.callback('Earn', 'earn-menu'),
            Markup.button.callback('Setting', 'setting-menu')
        ]);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Wallet', 'wallet-menu'),
            Markup.button.callback('Trade', 'trade-menu'),
            Markup.button.callback('Bots', 'bots-menu'),
            Markup.button.callback('Earn', 'earn-menu'),
            Markup.button.callback('Setting', 'setting-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Create wallet', 'create-wallet-menu'),
            Markup.button.callback('Import wallet', 'import-wallet-menu'),
            Markup.button.callback('Export wallet', 'export-wallet-menu'),
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('create-wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Add New', 'adding-new-wallet'),
            Markup.button.callback('Back', 'wallet-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageWalletTemplete.importAWallet({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('adding-new-wallet', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Create wallet', 'create-wallet-menu'),
            Markup.button.callback('Export wallet', 'import-wallet-menu'),
            Markup.button.callback('Export wallet', 'export-wallet-menu'),
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userAddsWallet({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.trade({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('import-wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Click here to start', 'importing-new-wallet'),
            Markup.button.callback('Back', 'wallet-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageWalletTemplete.importAWallet({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('importing-new-wallet', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userAddsWallet({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.trade({ wallets: response.user.wallets }), keyboard);
    });
    
    bot.action('export-wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageWalletTemplete.exportWallet({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('trade-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Buy', 'buy-coin-menu'),
            Markup.button.callback('Sell', 'sell-coin-menu'),
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('buy-coin-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            Markup.button.callback('Buy', 'buy-coin-menu'),
            Markup.button.callback('Sell', 'sell-coin-menu'),
            Markup.button.callback('Back', 'menu'),
        ], { wrap: (btn, index, currentRow) => true});

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const keyboard = Markup.inlineKeyboard([
            ...response.user.wallets.map((wallet, index) => {
                return Markup.button.callback(`Wallet ${index+1}- ${wallet.address}`, `buy-for-wallet-${index}`);
            }),
            Markup.button.callback('Back', 'trade-menu'),
        ], { wrap: (btn, index, currentRow) => true});

        ctx.reply(MessageTradeTemplete.selectWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    [ 1, 2, 3 ].forEach((index) => {
        bot.action(`buy-for-wallet-${index}`, async (ctx) => {
            const initialKeyboard = Markup.inlineKeyboard([
                Markup.button.callback('Buy', 'buy-coin-menu'),
                Markup.button.callback('Sell', 'sell-coin-menu'),
                Markup.button.callback('Back', 'menu'),
            ]);
    
            if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);
    
            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);
    
            const keyboard = Markup.inlineKeyboard([
                ...response.user.wallets.map((wallet, index) => {
                    return Markup.button.callback(`Wallet ${index}- ${wallet.address}`, `buy-for-wallet-${index}`);
                }),
                Markup.button.callback('Back', 'trade-menu'),
            ]);
    
            ctx.reply(MessageTradeTemplete.selectBuyingWalletAddress({ wallet: response.user.wallets[index] }), keyboard);
        });
    })

    bot.action('trade-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Buy', 'buy-coin-menu'),
            Markup.button.callback('Sell', 'sell-coin-menu'),
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('bots-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Buy', 'buy-coin-menu'),
            Markup.button.callback('Sell', 'sell-coin-menu'),
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('earn-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Buy', 'buy-coin-menu'),
            Markup.button.callback('Sell', 'sell-coin-menu'),
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('settings-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Buy', 'buy-coin-menu'),
            Markup.button.callback('Sell', 'sell-coin-menu'),
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });
    
    // Start the bot
    bot.launch();
}