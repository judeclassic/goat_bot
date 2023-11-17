import { Telegraf, Markup } from 'telegraf';
import { MessageTemplete } from '../../../data/handler/template/message';
import { UserModel } from '../../../data/repository/database/models/user';
import EncryptionRepository from '../../../data/repository/encryption';
import TradeRepository from '../../../data/repository/wallet/trade';
import WalletRepository from '../../../data/repository/wallet/wallet';
import TelegramService from '../telegram.service';

const INTEGRATION_WEB_HOST = 'https://goatbot.app';

export const useWalletBotRoutes = ({bot, walletRepository, tradeRepository, encryptionRepository, telegramService} : {
    bot: Telegraf,
    walletRepository: WalletRepository,
    tradeRepository: TradeRepository,
    encryptionRepository: EncryptionRepository;
    telegramService: TelegramService
}) => {
    bot.action('wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
            ],
            [   Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
            ],
            [   Markup.button.callback('Transfer', 'send-token-menu'),
                Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
            ],
            [Markup.button.callback('🔙 Back to menu', 'menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageTemplete.generateWalletEntities("Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances", response.user.wallets)

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

        ctx.reply(MessageTemplete.defaultMessage("Click on 'Add New' to create a new wallet"), keyboard);
    });

    bot.action('adding-new-wallet', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            [   Markup.button.callback('➕ Create new wallet', 'create-wallet-menu'),
                Markup.button.callback('⬇️ Import wallet', 'import-wallet-menu')
            ],
            [   Markup.button.callback('📤 Export wallet', 'export-wallet-menu'),
                Markup.button.callback('🗑️ Delete wallet', 'remove-wallet-menu')
            ],
            [   Markup.button.callback('💼 Send Token', 'send-token-menu'),
                Markup.button.callback('💼 Wallet balance', 'wallet-balance-menu')
            ],
            [Markup.button.callback('🔙 Back to menu', 'menu')]
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userAddsWallet({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageTemplete.generateWalletEntities("Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances", response.user.wallets)

        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });

    bot.action('import-wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Try again', 'import-new-wallet'),
            Markup.button.callback('🔙 Back', 'wallet-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.generateUserIDToken({ telegram_id });
        if (!response.token) return ctx.reply(response.message!, keyboard);

        const urlHost = getUrlForDomainWallet({ token: response.token, type: 'import_wallet'});

        const modifiedKeyboard = Markup.inlineKeyboard([
            Markup.button.webApp('Click here to import', urlHost),
            Markup.button.callback('🔙 Back', 'wallet-menu'),
        ]);

        ctx.reply(MessageTemplete.defaultMessage("Enter the wallet private key and send to add wallet"), modifiedKeyboard);
    });
    
    bot.action('export-wallet-menu', async (ctx) => {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🔙 Back', 'wallet-menu'),
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', keyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, keyboard);

        const { text, entities } = MessageTemplete.generateExportWalletEntities({wallets: response.user.wallets})
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

        const { text, entities } = MessageTemplete.generateWalletEntities("Select the wallet to remove", response.user.wallets);
        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
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

            ctx.reply(MessageTemplete.defaultMessage(`Click on "confirm" if you really want to remove this wallet ${response.user.wallets[wallet_number].address}`), keyboard);
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

        ctx.reply(MessageTemplete.defaultMessage("Check wallet balance"), keyboard);
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
            if (!response.tokens) return ctx.reply(response.message!, initialKeyboard);

            const keyboard = Markup.inlineKeyboard([[
                ...response.tokens.map((balance, index) => {
                    return Markup.button.callback(`Wallet ${index+1}`, `wallet-balance-${index+1}`);
                })],
                [Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);

            const { text, entities } = MessageTemplete.generateWalletBalanceEntities({balances: response.tokens })
            ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
        });
    });

    bot.action('send-token-menu', async (ctx) => {
        const initialKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Try again', 'send-from-wallet')],
            [Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);

        if (!ctx.chat) return ctx.reply('unable to process message', initialKeyboard);

        const telegram_id = ctx.chat.id.toString();
        const response = await telegramService.userOpensChat({ telegram_id });
        if (!response.user) return ctx.reply(response.message, initialKeyboard);

        const keyboard = Markup.inlineKeyboard([[
            ...response.user.wallets.map((wallet, index) => {
                const linkResponse = telegramService.generateUserIDToken({ telegram_id, wallet_address: wallet.address });
                const urlHost = getUrlForDomainWallet({ token: linkResponse.token?? "", type: 'transfer_token'});
                console.log(urlHost);
                return Markup.button.webApp(` Wallet ${index+1}`, urlHost);
            })],
            [Markup.button.callback('🔙 Back', 'wallet-menu')],
        ]);

        const { text, entities } = MessageTemplete.generateWalletEntities("Send token to another wallet address", response.user.wallets);

        ctx.reply(text, { ...keyboard, entities, disable_web_page_preview: true });
    });

    [ 1, 2, 3 ].forEach((data, wallet_number) => {
        bot.action( `send-token-${wallet_number+1}`, async (ctx) => {
            const initialKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('Try again', `send-token-${wallet_number+1}`)],
                [Markup.button.callback('🔙 Back', 'wallet-menu')],
            ]);

            if (!ctx.chat) return ctx.reply('unable to delete', initialKeyboard);

            const telegram_id = ctx.chat.id.toString();
            const linkResponse = await telegramService.generateUserIDTokenAndWallet({ telegram_id, wallet_number });
            if (!linkResponse.token) return ctx.reply(linkResponse.message!, initialKeyboard);
            const response = await telegramService.userOpensChat({ telegram_id });
            if (!response.user) return ctx.reply(response.message, initialKeyboard);

            const urlHost = getUrlForDomainWallet({ token: linkResponse.token, type: 'transfer_token'});


            const modifiedKeyboard = Markup.inlineKeyboard([
                Markup.button.webApp('Click here to send', urlHost),
                Markup.button.callback('🔙 Back', 'wallet-menu'),
            ]);

            const { text, entities } = MessageTemplete.generateWalletBalanceEntities({ message: "Send token to another wallet address", balances: response.user.wallets[wallet_number].others});

            ctx.reply(text, { ...modifiedKeyboard, entities, disable_web_page_preview: true });
        });
    });
} 

type UrlType = 'market_buy' | 'market_sell' | 'limit_buy' | 'limit_sell';

const getUrlForDomainTrade = ({ token, wallet, type }:{ token: string, wallet: string, type: UrlType }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}&wallet_address=${wallet}`;
    return url;
}

type UrlTypeWallet = 'import_wallet' | 'transfer_token' | 'transfer_etherium';

const getUrlForDomainWallet = ({ token, type }:{ token: string, type: UrlTypeWallet }) => {
    const url = `${INTEGRATION_WEB_HOST}/integrations/${type}?token=${token}`;
    return url;
}

