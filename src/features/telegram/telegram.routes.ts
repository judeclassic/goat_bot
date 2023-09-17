import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete, MessageWalletTemplete, MessageTradeTemplete } from '../../data/handler/template/message';
import { UserModel } from '../../data/repository/database/models/user';
import WalletRepository from '../../data/repository/wallet/wallet';
import TelegramService from './telegram.service';

const YOUR_BOT_TOKEN = '6010824016:AAE9Eohr5_lvNwD0fSTnbaDjjhkmrEhMBKM';
const INTEGRATION_HOST = 'https://app.uniswap.org/swap';

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
            Markup.button.callback('Create wallet', 'create-wallet-menu'),
            Markup.button.callback('Import wallet', 'import-wallet-menu'),
            Markup.button.callback('Export wallet', 'export-wallet-menu'),
            Markup.button.callback('Remove wallet', 'remove-wallet-menu'),
            Markup.button.callback('Back', 'menu')
        ], { wrap: (btn, index, currentRow) => true});

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
            Markup.button.callback('Back', 'menu')
        ], { wrap: (btn, index, currentRow) => true});

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
            [   Markup.button.callback('Execute a market buy order', 'buy-market-order-menu'),
                Markup.button.callback('Execute a market buy order', 'buy-market-order-menu'),
            ],
            [   Markup.button.callback('Place a limit buy order', 'sell-market-order-menu'),
                Markup.button.callback('Place a limit sell order', 'sell-limit-order-menu')
            ],
            [Markup.button.callback('View trading history', 'trade-history')],
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

        console.log(getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'buy_coin'}))

        const keyboard = Markup.inlineKeyboard([
            ...response.user.wallets.map((wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}- ${wallet.address}`, `${INTEGRATION_HOST}`);
            }),
            Markup.button.callback('Back', 'trade-menu'),
        ], { wrap: (btn, index, currentRow) => true});

        ctx.reply(MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('sell-market-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Buy', 'buy-coin-menu'), Markup.button.callback('Sell', 'sell-coin-menu')],
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        console.log(getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'sell_coin'}))

        const keyboard = Markup.inlineKeyboard([
            ...response.user.wallets.map((wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}- ${wallet.address}`, `${INTEGRATION_HOST}`);
            }),
            Markup.button.callback('Back', 'trade-menu'),
        ], { wrap: (btn, index, currentRow) => true});

        ctx.reply(MessageTradeTemplete.marketSellWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('buy-limit-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Buy', 'buy-market-order-menu')],
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        console.log(getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'buy_coin'}))

        const keyboard = Markup.inlineKeyboard([
            ...response.user.wallets.map((wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}- ${wallet.address}`, `${INTEGRATION_HOST}`);
            }),
            Markup.button.callback('Back', 'trade-menu'),
        ], { wrap: (btn, index, currentRow) => true});

        ctx.reply(MessageTradeTemplete.limitBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('sell-limit-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Buy', 'buy-coin-menu'), Markup.button.callback('Sell', 'sell-coin-menu')],
            [Markup.button.callback('Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        console.log(getUrlForDomain({ telegram_id, wallet: response.user.wallets[0].address, type: 'sell_coin'}))

        const keyboard = Markup.inlineKeyboard([
            ...response.user.wallets.map((wallet, index) => {
                return Markup.button.webApp(`Wallet ${index+1}- ${wallet.address}`, `${INTEGRATION_HOST}`);
            }),
            Markup.button.callback('Back', 'trade-menu'),
        ], { wrap: (btn, index, currentRow) => true});

        ctx.reply(MessageTradeTemplete.limitSellWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('bots-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([[
            Markup.button.callback('Activate Sniper Bot', 'activate-sniper-bot'),
            Markup.button.callback('Activate Frontrunner Bot', 'activate-frontrunner-bot'),
            Markup.button.callback('Activate Mirror Bot', 'activate-mirror-bot'),
            Markup.button.callback('Check Bot Performance', 'check-bot-performance'),
            Markup.button.callback('Back', 'menu'),
        ]]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageTemplete.welcome({ wallets: response.user.wallets }), keyboard);
    });

    //  /staking - Participate in staking
//    - /referralprogram - Refer friends and earn
//    - /earningshistory - View earnings history
//    - /claimrewards - Claim earned rewards


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

    bot.action('settings-menu', async (ctx) => {
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

const getUrlForDomain = ({ telegram_id, wallet, type }:{ telegram_id: string, wallet: string, type: 'buy_coin' | 'sell_coin' }) => {
    const url = `http://localhost:3000/integrations/${type}?user_id=${telegram_id}&wallet_address=${wallet}`;
    return url;
}