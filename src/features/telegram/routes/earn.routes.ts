import { Telegraf, Markup } from 'telegraf';
import { MessageEarnTemplate, MessageTemplete } from '../../../data/handler/template/message';
import EncryptionRepository from '../../../data/repository/encryption';
import TradeRepository from '../../../data/repository/wallet/__trade';
import WalletRepository from '../../../data/repository/wallet/wallet';
import TelegramService from '../telegram.service';

const INTEGRATION_WEB_HOST = 'https://goatbot.app';

export const useEarnBotRoutes = ({bot, walletRepository, tradeRepository, encryptionRepository, telegramService} : {
    bot: Telegraf,
    walletRepository: WalletRepository,
    tradeRepository: TradeRepository,
    encryptionRepository: EncryptionRepository;
    telegramService: TelegramService
}) => {
    bot.action('earn-menu', async (ctx) => {
        try {
            const keyboard = Markup.inlineKeyboard([
                [Markup.button.callback('👫 Refer & earn', 'refer-friends-and-earn')],
                [Markup.button.callback('🔙 Back', 'menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, keyboard);

            const { text, entities } = MessageTemplete.generateWalletEntities("Earning 🌱: Grow your seeds into mighty oaks! Dive into referrals 🤝 & stake your claim", response.user.wallets);
            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('refer-friends-and-earn', async (ctx) => {
        try {
            const intialKeyboard = Markup.inlineKeyboard([
                [ Markup.button.callback('🔙 Back', 'menu') ],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', intialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.userOpensChat({ telegram_id });
            const tokenResponse = await telegramService.generateUserIDToken({ telegram_id });
            if (!response.user) return ctx.reply(response.message, intialKeyboard);
            if (!tokenResponse.token) return ctx.reply(tokenResponse.message!, intialKeyboard);

            const urlHost = getUrlForDomainEarn({ token: tokenResponse.token, type: 'add_refer_code'});

            const keyboard = Markup.inlineKeyboard([
                [ Markup.button.callback('💼 Claim reward', "add_refer_code") ],
                [ Markup.button.webApp('📈 Enter ref code', urlHost) ],
                [ Markup.button.callback('🔙 Back', 'earn-menu') ],
            ]);

            ctx.reply(MessageEarnTemplate.generateReferalMessage(response), keyboard);
        } catch (err) {
            console.log(err)
        }
    });

    bot.action('add_refer_code', async (ctx) => {
        try {
            const intialKeyboard = Markup.inlineKeyboard([
                [ Markup.button.callback('🔙 Back', 'menu') ],
            ]);

            if (!ctx.chat) return ctx.reply('unable to process message', intialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const response = await telegramService.claimReferral({ telegram_id });
            const tokenResponse = await telegramService.generateUserIDToken({ telegram_id });
            if (!response.user) return ctx.reply(response.message, intialKeyboard);
            if (!tokenResponse.token) return ctx.reply(tokenResponse.message!, intialKeyboard);

            const urlHost = getUrlForDomainEarn({ token: tokenResponse.token, type: 'add_refer_code'});

            const keyboard = Markup.inlineKeyboard([
                [ Markup.button.webApp('💼 Claim reward', urlHost) ],
                [ Markup.button.webApp('📈 Enter ref code', urlHost) ],
                [ Markup.button.callback('🔙 Back', 'earn-menu') ],
            ]);

            ctx.reply(MessageEarnTemplate.generateReferalMessage(response), keyboard);
        } catch (err) {
            console.log(err)
        }
    });
}

type UrlTypeWallet = 'add_refer_code';

const getUrlForDomainEarn = ({ token, type }:{ token: string, type: UrlTypeWallet }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}`;
    return url;
}