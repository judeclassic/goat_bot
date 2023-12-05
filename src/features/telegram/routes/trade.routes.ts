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
                [   Markup.button.callback('🟢 Swap', 'market-order-menu'),
                    Markup.button.callback('🟠 Limit order', 'limit-order-menu')
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

    bot.action('market-order-menu', async (ctx) => {
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
                    const urlHost = getUrlForDomainTrade({ token: linkResponse.token?? "", wallet: wallet.address?? "", type: 'market_swap'});
                    console.log(urlHost);
                    return Markup.button.webApp(` Wallet ${index+1}`, urlHost);
                })],
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            const { text, entities } = MessageTemplete.generateWalletEntities(
                                "🐐 GoatBot | Swap Now 💸\n\n"+
                                "Got profits or adjusting your assets? Easily swap your holdings with GoatBot.\n\n"+
                                
                                "🔄 How to Swap:\n"+
                                "- Click /swap to start.\n"+
                                "- Enter token contract address.\n"+
                                "- Choose pair & amount.\n"+
                                "- Confirm & execute.\n\n"+
                                
                                "Ready to swap? Click /swap now!\n"
            , response.user.wallets, false);

            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('limit-order-menu', async (ctx) => {
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
                    const urlHost = getUrlForDomainTrade({ token: linkResponse.token?? "", wallet: wallet.address?? "", type: 'limit_swap'});
                    return Markup.button.webApp(` Wallet ${index+1}`, urlHost);
                })],
                [Markup.button.callback('🔙 Back', 'trade-menu')],
            ]);

            const { text, entities } = MessageTemplete.generateWalletEntities(
                "🐐 GoatBot | Limit Orders 📈\n\n"+
                "Ready for strategic moves? Place limit buy/sell orders with GoatBot for precise control over your crypto assets.\n\n"+
                "🔄 How to Set a Limit Order:\n"+
                "- Click /limit order to initiate.\n"+
                "- Enter token contract address.\n"+
                "- Specify pair, amount, and limit price.\n"+
                "- Confirm & set your limit swap order.\n\n"+
                "Set your limits! Click /limit order now.\n"
            , response.user.wallets, false);

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

type UrlType = 'market_buy' | 'market_sell' | 'limit_buy' | 'limit_sell' | 'market_swap' | 'limit_swap';

const getUrlForDomainTrade = ({ token, wallet, type }:{ token: string, wallet: string, type: UrlType }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}&wallet_address=${wallet}`;
    return url;
}