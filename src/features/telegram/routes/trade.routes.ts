import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete } from '../../../data/handler/template/message';
import EncryptionRepository from '../../../data/repository/encryption';
import TradeRepository from '../../../data/repository/wallet/__trade';
import WalletRepository from '../../../data/repository/wallet/wallet';
import TelegramService from '../telegram.service';

const INTEGRATION_WEB_HOST = 'https://goatbot.app';

export const useTradeBotRoutes = ({bot, walletRepository, tradeRepository, encryptionRepository, telegramService} : {
    bot: Telegraf,
    walletRepository: WalletRepository,
    tradeRepository: TradeRepository,
    encryptionRepository: EncryptionRepository;
    telegramService: TelegramService
}) => {
    bot.action('trade-menu', async (ctx) => {
        try {
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

            const { text, entities } = MessageTemplete.generateWalletEntities("Trading 📈: Dive into the financial oceans! Market Buy 🛍 & sell 🏷, Limit Buy 🛍 & sell 🏷, and keep a hawk's 👁 on your trades.", response.user.wallets);
            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('buy-market-order-menu', async (ctx) => {
        try {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('Buy', 'buy-market-order-menu')],
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);
            

            const keyboard = Markup.inlineKeyboard([[
                ...response.user.wallets.map((wallet, index) => {
                    const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                    const urlHost = getUrlForDomainTrade({ token: linkResponse.token?? "", wallet: wallet.address?? "", type: 'market_buy'});
                    console.log(urlHost);
                    return Markup.button.webApp(` Wallet ${index+1}`, urlHost);
                })],
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            const { text, entities } = MessageTemplete.generateWalletEntities("🟢 Buy Now 💸: Ready to expand your crypto portfolio? Dive in and acquire your desired cryptocurrency instantly with our smooth and straightforward buying process.", response.user.wallets);

            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    [ 1, 2, 3 ].forEach((index, wallet_number) => {
        bot.action( `buy-market-order-${wallet_number+1}`, async (ctx) => {
            try {
                const initialKeyboard = Markup.inlineKeyboard([
                    [Markup.button.callback('try again', `send-coin-${wallet_number+1}`)],
                    [Markup.button.callback('🔙 Back', 'trade-menu')],
                ]);

                if (!ctx.chat) return ctx.reply('unable to delete', initialKeyboard);

                const telegram_id = ctx.chat.id.toString();
                const response = await telegramService.generateUserIDTokenAndWallet({ telegram_id, wallet_number });
                if (!response.token) return ctx.reply(response.message!, initialKeyboard);

                const urlHost = getUrlForDomainTrade({ token: response.token, wallet: response.wallet_address, type: 'market_buy'});

                const modifiedKeyboard = Markup.inlineKeyboard([
                    Markup.button.webApp('Click here to proceed', urlHost),
                    Markup.button.callback('🔙 Back', 'trade-menu')
                ]);

                ctx.reply(MessageTemplete.defaultMessage("Click here to proceed your buying token"), modifiedKeyboard);
            } catch (err) {
                console.log(err)
            }
        });
    });

    bot.action('sell-market-order-menu', async (ctx) => {
        try {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);

            const keyboard = Markup.inlineKeyboard([[
                ...response.user.wallets.map((wallet, index) => {
                    const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                    const urlHost = getUrlForDomainTrade({ token: linkResponse.token?? "", wallet: wallet.address?? "", type: 'market_sell'});
                    console.log(urlHost);
                    return Markup.button.webApp(` Wallet ${index+1}`, urlHost);
                })],
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            const { text, entities } = MessageTemplete.generateWalletEntities("🔴 Sell Now 💸: Got profits? Or just reshuffling your assets? Easily liquidate your holdings at current market rates. Profit-taking has never been this seamless", response.user.wallets);

            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    [ 1, 2, 3 ].forEach((data, wallet_number) => {
        try {
            bot.action( `sell-market-order-${wallet_number+1}`, async (ctx) => {
                const initialKeyboard = Markup.inlineKeyboard([
                    [Markup.button.callback('try again', `send-coin-${wallet_number+1}`)],
                    [Markup.button.callback('🔙 Back', 'trade-menu')]
                ]);

                if (!ctx.chat) return ctx.reply('unable to delete', initialKeyboard);

                const telegram_id = ctx.chat.id.toString();
                const response = await telegramService.generateUserIDTokenAndWallet({ telegram_id, wallet_number });
                if (!response.token) return ctx.reply(response.message!, initialKeyboard);

                const urlHost = getUrlForDomainTrade({ token: response.token, wallet: response.wallet_address, type: 'market_sell'});
                console.log(urlHost);
                
                const modifiedKeyboard = Markup.inlineKeyboard([
                    Markup.button.webApp('Click here to send', urlHost),
                    Markup.button.callback('🔙 Back', 'trade-menu')
                ]);

                ctx.reply(MessageTemplete.defaultMessage("Click here to proceed your buying"), modifiedKeyboard);
            });
        } catch (err) {
            console.log(err)
        }
    });


    bot.action('buy-limit-order-menu', async (ctx) => {
        try {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);

            const tokenResponse = await telegramService.generateUserIDToken({ telegram_id });
            if (!tokenResponse.token) return ctx.reply(tokenResponse.message??'', initialKeyboard);

            const urlHost = getUrlForDomainTrade({ token: tokenResponse.token, wallet: response.user.wallets[0].address, type: 'limit_buy'});
            console.log(urlHost);

            const keyboard = Markup.inlineKeyboard([[
                ...response.user.wallets.map((wallet, index) => {
                    const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                    const urlHost = getUrlForDomainTrade({ token: linkResponse.token?? "", wallet: wallet.address?? "", type: 'limit_buy'});
                    console.log(urlHost);
                    return Markup.button.webApp(` Wallet ${index+1}`, urlHost);
                })],
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            const { text, entities } = MessageTemplete.generateWalletEntities("🟡 Limit Buy Order 🔒: Be the market ninja! 🥷 Set a price point at which you wish to purchase, and let GoatBot do the rest. We'll buy when the price is just right!", response.user.wallets);
            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('sell-limit-order-menu', async (ctx) => {
        try {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);

            const tokenResponse = await telegramService.generateUserIDToken({ telegram_id });
            if (!tokenResponse.token) return ctx.reply(tokenResponse.message??'', initialKeyboard);

            const urlHost = getUrlForDomainTrade({ token: tokenResponse.token, wallet: response.user.wallets[0].address, type: 'limit_sell'})

            const keyboard = Markup.inlineKeyboard([[
                ...response.user.wallets.map((wallet, index) => {
                    const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                    const urlHost = getUrlForDomainTrade({ token: linkResponse.token?? "", wallet: wallet.address?? "", type: 'limit_sell'});
                    console.log(urlHost);
                    return Markup.button.webApp(` Wallet ${index+1}`, urlHost);
                })],
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            const { text, entities } = MessageTemplete.generateWalletEntities("🟠 Limit Sell Order 🔒: Secure your profits or limit losses! Decide on a selling price, and GoatBot will execute the trade when your set price is hit. Sleep easy, knowing you're in control.", response.user.wallets);
            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('view-transaction-history', async (ctx) => {
        try {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);

            const keyboard = Markup.inlineKeyboard([[
                ...response.user.wallets.map((wallet, index) => {
                    return Markup.button.webApp(`Wallet ${index+1}`, `https://etherscan.io/txs?a=${wallet.address}`);
                })],
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            const { text, entities } = MessageTemplete.generateWalletEntities(" 📜 View Transaction History 🔍: Curious about your past maneuvers? Take a stroll down memory lane and review all your trade activities, beautifully documented and easy to understand", response.user.wallets);
            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });
    
} 

type UrlType = 'market_buy' | 'market_sell' | 'limit_buy' | 'limit_sell';

const getUrlForDomainTrade = ({ token, wallet, type }:{ token: string, wallet: string, type: UrlType }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}&wallet_address=${wallet}`;
    return url;
}