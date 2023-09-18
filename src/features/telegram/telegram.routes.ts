import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete, MessageWalletTemplete, MessageTradeTemplete } from '../../data/handler/template/message';
import { UserModel } from '../../data/repository/database/models/user';
import WalletRepository from '../../data/repository/wallet/wallet';
import TelegramService from './telegram.service';

const YOUR_BOT_TOKEN = '6010824016:AAE9Eohr5_lvNwD0fSTnbaDjjhkmrEhMBKM';
const INTEGRATION_HOST = 'https://app.uniswap.org/swap';
const INTEGRATION_WEB_HOST = 'https://goatbot.app';

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
        ], { wrap: (btn, index, currentRow) => true});

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
        ], { wrap: (btn, index, currentRow) => true});

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Create wallet', 'create-wallet-menu')],
            [Markup.button.callback('Import wallet', 'import-wallet-menu')],
            [Markup.button.callback('Export wallet', 'export-wallet-menu')],
            [Markup.button.callback('Remove wallet', 'remove-wallet-menu')],
            [Markup.button.callback('Back', 'menu')]
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
            [Markup.button.callback('Create wallet', 'create-wallet-menu')],
            [Markup.button.callback('Import wallet', 'import-wallet-menu')],
            [Markup.button.callback('Export wallet', 'export-wallet-menu')],
            [Markup.button.callback('Remove wallet', 'remove-wallet-menu')],
            [Markup.button.callback('Back', 'menu')]
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
            Markup.button.callback('Back', 'wallet-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageWalletTemplete.exportWallet({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('remove-wallet-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Buy', 'remove-wallet-menu')],
            [Markup.button.callback('Back', 'wallet-menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((_wallet, index) => {
                return Markup.button.callback(`Wallet ${index+1}`, `delete-wallet-${index+1}`);
            })],
            [Markup.button.callback('Back', 'wallet-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });
    [ 1, 2, 3 ].forEach((data, wallet_number) => {
        bot.action( `delete-wallet-${wallet_number+1}`, async (ctx) => {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('try again', `delete-wallet-${wallet_number+1}`)],
                [Markup.button.callback('Back', 'wallet-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to delete', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userDeleteWallet({ telegram_id, wallet_number });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);

            const keyboard = Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return Markup.button.callback(`Wallet ${index+1}`, `delete-wallet-${index+1}`);
                })],
                [Markup.button.callback('Back', 'wallet-menu')],
            ]);

            ctx.reply(MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
        });
    });

    bot.action('trade-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('Buy', 'buy-market-order-menu'),
                Markup.button.callback('Sell', 'sell-market-order-menu'),
            ],
            [   Markup.button.callback('Limit Buy', 'buy-limit-order-menu'),
                Markup.button.callback('Limit Sell', 'sell-limit-order-menu')
            ],
            [Markup.button.callback('View transaction history', 'view-transaction-history')],
            [Markup.button.callback('Back', 'menu'),]
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('buy-market-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Buy', 'buy-market-order-menu')],
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const urlHost = getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'market_buy'});
        console.log(urlHost);

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((_wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}`, `${urlHost}`);
            })],
            [Markup.button.callback('Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('sell-market-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const urlHost = getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'market_sell'})

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((_wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}`, `${urlHost}`);
            })],
            [Markup.button.callback('Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.marketSellWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('buy-limit-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const urlHost = getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'limit_buy'});

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((_wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}`, `${urlHost}`);
            })],
            [Markup.button.callback('Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.limitBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('sell-limit-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const urlHost = getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'limit_sell'})

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((_wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}`, `${urlHost}`);
            })],
            [Markup.button.callback('Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.limitSellWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('view-transaction-history', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        // const url = getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'sell_coin'});

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}`, `https://etherscan.io/txs?a=${wallet.address}`);
            })],
            [Markup.button.callback('Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.viewTransactionHistory({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('bots-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Activate Sniper Bot', 'activate-sniper-bot')],
            [Markup.button.callback('Activate Frontrunner Bot', 'activate-frontrunner-bot')],
            [Markup.button.callback('Activate Mirror Bot', 'activate-mirror-bot')],
            [Markup.button.callback('Check Bot Performance', 'check-bot-performance')],
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('earn-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Participate in staking', 'participate-in-staking'),
            Markup.button.callback('Refer friends and earn', 'refer-friends-and-earn'),
            Markup.button.callback('View earnings history', 'view-earnings-history'),
            Markup.button.callback('Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('setting-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Delete Account', 'buy-coin-menu'),
            Markup.button.callback('Add Password', 'sell-coin-menu'),
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

type UrlType = 'market_buy' | 'market_sell' | 'limit_buy' | 'limit_sell'

const getUrlForDomain = ({ telegram_id, wallet, type }:{ telegram_id: string, wallet: string, type: UrlType }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?user_id=${telegram_id}&wallet_address=${wallet}`;
    return url;
}