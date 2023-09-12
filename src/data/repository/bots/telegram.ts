import TelegramBot from "node-telegram-bot-api";

const token = '6010824016:AAE9Eohr5_lvNwD0fSTnbaDjjhkmrEhMBKM';

const bot = new TelegramBot(token, {polling: true});
class TelegramBotRepository {
    constructor(){
        bot.onText(/\/echo (.+)/, (msg, match) => {
            if (!match) return;

            const chatId = msg.chat.id;
            const resp = match[1];

            bot.sendMessage(chatId, resp);
        });

        bot.on('message', (msg) => {
            const chatId = msg.chat.id;

            bot.sendMessage(chatId, 'Received your message');

            bot.sendMessage(msg.chat.id, "Welcome", {
                "reply_markup": {
                    "keyboard": [["Sample text", "Second sample"],   ["Keyboard"], ["I'm robot"]] as any
                }
            });
        });
    }
}

export default TelegramBotRepository;