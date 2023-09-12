import TelegramBot from "node-telegram-bot-api";
import { MessageTemplete } from "../../../data/handler/template/message";
import TelegramService from "../telegram.service";

class BotMainController {
    private bot: TelegramBot;
    private telegramService: TelegramService

    constructor({ bot, telegramService }:{bot: TelegramBot, telegramService: TelegramService}) {
        this.bot = bot;
        this.telegramService = telegramService;
    }

    mainMenu = async (msg: TelegramBot.Message) => {
        const telegram_id = msg.chat.id;
        const response = await this.telegramService.userOpensChat({ telegram_id: telegram_id.toString() });
        if (!response.user) return this.bot.sendMessage(telegram_id, response.message ?? 'unable to retrieve wallets');
        this.bot.sendMessage(telegram_id, MessageTemplete.welcome({ wallets: response.user.wallets }), {
            "reply_markup": {
                "resize_keyboard": true,
                "keyboard": [
                    [{text: "Wallet", }],
                    [{text: "Trade"}],
                    [{text: "Bots"}],
                    [{text: "Earn"}],
                    [{text: "Setting"}]
                ],
            }
        })
    }

    walletMenu = async (msg: TelegramBot.Message) => {
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

    tradeMenu = async (msg: TelegramBot.Message) => {
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

    botsMenu = async (msg: TelegramBot.Message) => {
        const telegram_id = msg.chat.id;
        const response = await this.telegramService.userOpensChat({ telegram_id: telegram_id.toString() });
        if (!response.user) return this.bot.sendMessage(telegram_id, response.message ?? 'unable to retrieve wallets');
        this.bot.sendMessage(telegram_id, MessageTemplete.welcome({ wallets: response.user.wallets }), {
            "reply_markup": {
                "resize_keyboard": true,
                "keyboard": [
                    [{text: "Snipper Bot"}],
                    [{text: "Mirror Bot"}],
                    [{text: "Front Runner Bot"}],
                    [{text: "Cancel Bot"}]
                ],
            }
        });
    }

    settingMenu = async (msg: TelegramBot.Message) => {
        const telegram_id = msg.chat.id;
        const response = await this.telegramService.userOpensChat({ telegram_id: telegram_id.toString() });
        if (!response.user) return this.bot.sendMessage(telegram_id, response.message ?? 'unable to retrieve wallets');
        this.bot.sendMessage(telegram_id, MessageTemplete.welcome({ wallets: response.user.wallets }), {
            "reply_markup": {
                "resize_keyboard": true,
                "keyboard": [
                    [{text: "Add Email"}],
                    [{text: "Cancel"}]
                ],
            }
        });
    }
}

export default BotMainController;