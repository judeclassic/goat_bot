import TelegramBot from 'node-telegram-bot-api';

import { UserModel } from '../../data/repository/database/models/user';
import WalletRepository from '../../data/repository/wallet/wallet';

import TelegramService from './telegram.service';

import BotMainController from './controller/telegram.controller';
import BotWalletController from './controller/wallet.controller';

const token = '6010824016:AAE9Eohr5_lvNwD0fSTnbaDjjhkmrEhMBKM';

export const useTelegramBot = () => {
    const bot = new TelegramBot(token, {polling: true});
    const walletRepository = new WalletRepository();
    const telegramService = new TelegramService({ userModel: UserModel, walletRepository });

    const botController = new BotMainController({ bot, telegramService });

    const botWalletController = new BotWalletController({ bot, telegramService });

    bot.on('message', async (msg) => {
        const telegram_id = msg.chat.id;
        bot.deleteMessage(telegram_id, msg.message_id);

        requestHandler(msg, '/start', botController.mainMenu);
        requestHandler(msg, 'wallet', botController.walletMenu);
        requestHandler(msg, 'trade', botController.tradeMenu);
        requestHandler(msg, 'bots', botController.botsMenu);
        requestHandler(msg, 'setting', botController.settingMenu);

        requestHandler(msg, 'create allet', botWalletController.createWallet);
        requestHandler(msg, 'import wallet', botWalletController.importWallet);
        requestHandler(msg, 'export wallet', botWalletController.exportWallet);

        requestHandler(msg, 'cancel', botController.mainMenu);

        // useMarketRoutes({ msg, botWalletController})
    });
}

const requestHandler = (msg: any, command: string, action: (msg: TelegramBot.Message) => Promise<TelegramBot.Message | undefined>) => {
    if (msg.text?.toLowerCase() === command) action(msg);
}