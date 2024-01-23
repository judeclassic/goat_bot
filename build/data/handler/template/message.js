"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEarnTemplate = exports.MessageTemplete = exports.Translate = void 0;
const user_1 = require("../../repository/database/models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const english_message_1 = require("./english_message");
const modern_chinese_message_1 = require("./modern_chinese_message");
const traditional_chinese_message_1 = require("./traditional_chinese_message");
const HandleLanguageMessage = (language) => {
    if (language === user_1.Language.modern_chinese)
        english_message_1.EnglishMessageTemplete;
    if (language === user_1.Language.modern_chinese)
        modern_chinese_message_1.ModernChineseMessageTemplete;
    if (language === user_1.Language.traditional_chinese)
        modern_chinese_message_1.ModernChineseMessageTemplete;
    return english_message_1.EnglishMessageTemplete;
};
const HandleEarnLanguageMessage = (language) => {
    if (language === user_1.Language.modern_chinese)
        english_message_1.EnglishMessageEarnTemplate;
    if (language === user_1.Language.modern_chinese)
        modern_chinese_message_1.ModernChineseMessageEarnTemplate;
    if (language === user_1.Language.traditional_chinese)
        traditional_chinese_message_1.TradtionalChineseMessageEarnTemplate;
    return english_message_1.EnglishMessageEarnTemplate;
};
const HandleLanguage = (message, language) => {
    if (language === user_1.Language.modern_chinese)
        english_message_1.EnglishMessageEarnTemplate;
    if (language === user_1.Language.modern_chinese)
        modern_chinese_message_1.ModernChineseMessageEarnTemplate;
    if (language === user_1.Language.traditional_chinese)
        traditional_chinese_message_1.TradtionalChineseMessageEarnTemplate;
    return english_message_1.EnglishMessageEarnTemplate;
};
class Translate {
    constructor(language) {
        this.changeLanguage = (language) => {
            this.language = language;
        };
        this.c = ({ en, tch }) => {
            switch (this.language) {
                case user_1.Language.english:
                    return en;
                case user_1.Language.traditional_chinese:
                    return tch;
                default:
                    return en;
            }
        };
        this.language = language;
    }
}
exports.Translate = Translate;
class MessageTemplete {
}
MessageTemplete.decryptToken = (data) => {
    return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
};
MessageTemplete.welcome = (language) => HandleLanguageMessage(language).welcome();
MessageTemplete.defaultMessage = (message, language) => HandleLanguageMessage(language).defaultMessage(message);
MessageTemplete.generateWalletEntities = (message, wallets, language, isTitled = true) => HandleLanguageMessage(language).generateWalletEntities(message, wallets, isTitled);
MessageTemplete.generateExportWalletEntities = ({ wallets }, language) => HandleLanguageMessage(language).generateExportWalletEntities({ wallets });
MessageTemplete.generateWalletBalanceEntities = ({ message = "Elevate Your Crypto Trades with GOATBOT– Greatest Of All Telegram Bots", balances }, language) => HandleLanguageMessage(language).generateWalletBalanceEntities({ message, balances });
MessageTemplete.buyNotificationMessage = (user, data, language) => HandleLanguageMessage(language).buyNotificationMessage(user, data);
exports.MessageTemplete = MessageTemplete;
class MessageEarnTemplate {
}
MessageEarnTemplate.generateReferalMessage = (user, language) => HandleEarnLanguageMessage(language).generateReferalMessage(user);
exports.MessageEarnTemplate = MessageEarnTemplate;
