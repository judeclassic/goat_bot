import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete, MessageWalletTemplete, MessageTradeTemplete } from '../../data/handler/template/message';
import { UserModel } from '../../data/repository/database/models/user';
import TradeRepository from '../../data/repository/wallet/trade';
import WalletRepository from '../../data/repository/wallet/wallet';
import TelegramService from './telegram.service';

const INTEGRATION_WEB_HOST = 'https://goatbot.app';

export const useTelegramBot = () => {
    const YOUR_BOT_TOKEN = process.env.YOUR_BOT_TOKEN!;

    const bot = new Telegraf(YOUR_BOT_TOKEN);
    const walletRepository = new WalletRepository();
    const tradeRepository = new TradeRepository();
    const telegramService = new TelegramService({ userModel: UserModel, walletRepository, tradeRepository });
    
    bot.start(async (ctx) => {
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

        const { text, entities } = MessageTemplete.generateWalletEntities({wallets: response.user.wallets})
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });

    bot.action('menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('💼 Wallet hub', 'wallet-menu'),
                Markup.button.callback('💹 Start trading', 'trade-menu'),
            ],
            [   Markup.button.callback('🤖 Bot center', 'bots-menu'),
                Markup.button.callback('💰 Earn rewards', 'earn-menu')],
            [Markup.button.callback('🔧 Settings & tools', 'setting-menu')],
        ]);
        
        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageTemplete.generateWalletEntities({wallets: response.user.wallets})
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });

    bot.action('wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
            ],
            [   Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
            ],
            [Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')],
            [Markup.button.callback('🔙 Back to menu', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageWalletTemplete.generateWalletEntities({wallets: response.user.wallets})

        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });
    

    bot.action('create-wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Add New', 'adding-new-wallet'),
            Markup.button.callback('🔙 Back 🔄', 'wallet-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageWalletTemplete.importAWallet({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('adding-new-wallet', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
            ],
            [   Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
            ],
            [Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')],
            [Markup.button.callback('🔙 Back to menu', 'menu')]
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userAddsWallet({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageWalletTemplete.generateWalletEntities({ wallets: response.user.wallets })

        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });

    bot.action('import-wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Click here to start', 'importing-new-wallet'),
            Markup.button.callback('🔙 Back', 'wallet-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        ctx.reply(MessageWalletTemplete.importAWallet({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('importing-new-wallet', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🔙 Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userAddsWallet({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        // ctx.reply(MessageTemplete.trade({ wallets: response.user.wallets }), keyboard);
        const { text, entities } = MessageTemplete.generateWalletEntities({wallets: response.user.wallets})
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });
    
    bot.action('export-wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🔙 Back', 'wallet-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageWalletTemplete.generateExportWalletEntities({wallets: response.user.wallets})
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });

    bot.action('remove-wallet-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Buy', 'remove-wallet-menu')],
            [Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((_wallet, index) => {
                return Markup.button.callback(`Wallet ${index+1}`, `delete-wallet-${index+1}`);
            })],
            [Markup.button.callback('🔙 Back 🔄', 'wallet-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    [ 1, 2, 3 ].forEach((data, wallet_number) => {
        bot.action( `delete-wallet-${wallet_number+1}`, async (ctx) => {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('try again', `delete-wallet-${wallet_number+1}`)],
                [Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to delete', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userDeleteWallet({ telegram_id, wallet_number });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);

            const keyboard = Markup.inlineKeyboard([[
                ...response.user.wallets.map((_wallet, index) => {
                    return Markup.button.callback(`Wallet ${index+1}`, `delete-wallet-${index+1}`);
                })],
                [Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);

            ctx.reply(MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
        });
    });

    bot.action('wallet-balance-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Buy', 'remove-wallet-menu')],
            [Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((_wallet, index) => {
                return Markup.button.callback(`Wallet ${index+1}`, `wallet-balance-${index+1}`);
            })],
            [Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    [ 1, 2, 3 ].forEach((data, wallet_number) => {
        bot.action( `wallet-balance-${wallet_number+1}`, async (ctx) => {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('try again', `wallet-balance-${wallet_number+1}`)],
                [Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to delete', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.getGeneralBalance({ telegram_id, wallet_number });
            if (!response.balances) return ctx.reply(response.message!, initialKeyboard);

            const keyboard = Markup.inlineKeyboard([[
                ...response.balances.map((balance, index) => {
                    return Markup.button.callback(`Wallet ${index+1}`, `wallet-balance-${index+1}`);
                })],
                [Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);

            const { text, entities } = MessageWalletTemplete.generateWalletBalanceEntities({balances: response.balances})

            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        });
    });

    bot.action('trade-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('🟢 Buy now', 'buy-market-order-menu'),
                Markup.button.callback('🔴 Sell now', 'sell-market-order-menu'),
            ],
            [   Markup.button.callback('🟡 Limit buy order', 'buy-limit-order-menu'),
                Markup.button.callback('🟠 Limit sell order', 'sell-limit-order-menu')
            ],
            [Markup.button.callback('📜 View transactions ', 'view-transaction-history')],
            [Markup.button.callback('🔙 Back', 'menu'),]
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageWalletTemplete.generateWalletEntities({wallets: response.user.wallets})
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        // ctx.reply(MessageTemplete.welcome() ,keyboard);
    });

    bot.action('buy-market-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Buy', 'buy-market-order-menu')],
            [Markup.button.callback('🔙 Back', 'menu')],
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
            [Markup.button.callback('🔙 Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.marketBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('sell-market-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 Back', 'menu')],
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
            [Markup.button.callback('🔙 Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.marketSellWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('buy-limit-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 Back', 'menu')],
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
            [Markup.button.callback('🔙 Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.limitBuyWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('sell-limit-order-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 Back', 'menu')],
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
            [Markup.button.callback('🔙 Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.limitSellWalletAddress({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('view-transaction-history', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 Back', 'menu')],
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
            [Markup.button.callback('🔙 Back', 'trade-menu')],
        ]);

        ctx.reply(MessageTradeTemplete.viewTransactionHistory({ wallets: response.user.wallets }), keyboard);
    });

    bot.action('bots-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🎯 Activate sniper bot', 'activate-sniper-bot')],
            [Markup.button.callback('🚀 Activate frontrunner bot', 'activate-frontrunner-bot')],
            [Markup.button.callback('🪞 Activate mirror bot', 'activate-mirror-bot')],
            [Markup.button.callback('📊 Check bot stats', 'check-bot-performance')],
            [Markup.button.callback('🔙 Back', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageTemplete.generateWalletEntities({wallets: response.user.wallets})
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        // ctx.reply(MessageTemplete.welcome() ,keyboard);
    });

    bot.action('earn-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('📈 Stake & earn', 'participate-in-staking'),
            Markup.button.callback('👫 Refer & earn', 'refer-friends-and-earn'),
            Markup.button.callback('📘 View earnings', 'view-earnings-history'),
            Markup.button.callback('🔙 Back', 'menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageWalletTemplete.generateWalletEntities({wallets: response.user.wallets})
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        // ctx.reply(MessageTemplete.welcome() ,keyboard);
    });

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

        const { text, entities } = MessageWalletTemplete.generateWalletEntities({wallets: response.user.wallets})
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        ctx.reply(MessageTemplete.welcome() ,keyboard);
    });

    bot.on('message', (text) => {
        console.log(text.message);
    });
    
    // Start the bot
    bot.launch();
}

type UrlType = 'market_buy' | 'market_sell' | 'limit_buy' | 'limit_sell'

const getUrlForDomain = ({ telegram_id, wallet, type }:{ telegram_id: string, wallet: string, type: UrlType }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?user_id=${telegram_id}&wallet_address=${wallet}`;
    return url;
}