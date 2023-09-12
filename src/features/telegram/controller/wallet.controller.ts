import TelegramBot from "node-telegram-bot-api";
import { MessageTemplete } from "../../../data/handler/template/message";
import TelegramService from "../telegram.service";

class BotWalletController {
    private bot: TelegramBot;
    private telegramService: TelegramService

    constructor({ bot, telegramService }:{bot: TelegramBot, telegramService: TelegramService}) {
        this.bot = bot;
        this.telegramService = telegramService;
    }

    createWallet = async (msg: TelegramBot.Message) => {
        const telegram_id = msg.chat.id;
        const response = await this.telegramService.userAddsWallet({ telegram_id: telegram_id.toString() });
        if (!response.user) return this.bot.sendMessage(telegram_id, response.message ?? 'unable to retrieve wallets');
        this.bot.sendMessage(telegram_id, MessageTemplete.trade({ wallets: response.user.wallets }), {
            "reply_markup": {
                "resize_keyboard": true,
                "keyboard": [
                    [{text: "-Send Wallet"}],
                    [{text: "Import wallet"}],
                    [{text: "Export wallet"}],
                    [{text: "Cancel"}]
                ],
            }
        })
    }

    importWallet = async (msg: TelegramBot.Message) => {
        const telegram_id = msg.chat.id;
        const response = await this.telegramService.userOpensChat({ telegram_id: telegram_id.toString() });
        if (!response.user) return this.bot.sendMessage(telegram_id, response.message ?? 'unable to retrieve wallets');
        this.bot.sendMessage(telegram_id, MessageTemplete.welcome({ wallets: response.user.wallets }), {
            "reply_markup": {
                "resize_keyboard": true,
                "keyboard": [
                    [{text: "Create wallet"}],
                    [{text: "Import wallet"}],
                    [{text: "Export wallet"}],
                    [{text: "Cancel"}]
                ],
            }
        });
    }

    exportWallet = async (msg: TelegramBot.Message) => {
        const telegram_id = msg.chat.id;
        const response = await this.telegramService.userOpensChat({ telegram_id: telegram_id.toString() });
        if (!response.user) return this.bot.sendMessage(telegram_id, response.message ?? 'unable to retrieve wallets');
        this.bot.sendMessage(telegram_id, MessageTemplete.welcome({ wallets: response.user.wallets }), {
            "reply_markup": {
                "resize_keyboard": true,
                "keyboard": [
                    [{text: "Buy"}, {text: "Sell"}],
                    [{text: "Import wallet"}],
                    [{text: "Export wallet"}],
                    [{text: "Cancel"}]
                ],
            }
        });
    }
}

export default BotWalletController;