"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModernChineseMessageEarnTemplate = exports.ModernChineseMessageTemplete = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ModernChineseMessageTemplete {
}
_a = ModernChineseMessageTemplete;
ModernChineseMessageTemplete.decryptToken = (data) => {
    return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
};
ModernChineseMessageTemplete.welcome = () => ("══════[ 🐐 GoatBot 🐐 ]══════\n" +
    "🎉 恭喜您找到了 G.O.A.T（最棒的 Telegram）加密機器人！我們來這裡是為了加速您的加密之旅。\n\n" +
    "📖 快速指南：\n\n" +
    "1. 錢包中心 📔：您的加密貨幣指揮中心！檢視、建立、匯入、管理錢包、發送/接收和查看這些 💰 餘額。\n\n" +
    "2. 交易📈：潛入金融海洋！市場買入🛍和賣出🏷，限價買入🛍和賣出🏷，並在交易中保持鷹派👁。\n\n" +
    "3. 機器人中心 🤖：像專業人士一樣自動化！狙擊手 🎯、領跑者 🏃、鏡像 🪞 機器人等。\n\n" +
    "4. 賺錢 🌱：將你的種子培育成參天大樹！深入了解推薦 🤝 並提出你的主張 🏰。\n\n" +
    "5. 設定 ⚙️：按照您的風格自訂 GoatBot！自訂、調整並使其真正屬於您。\n");
ModernChineseMessageTemplete.defaultMessage = (message) => ("══════[ 🐐 GoatBot 🐐 ]══════\n" +
    ` ${message}\n` +
    "_______________________________________________\n");
ModernChineseMessageTemplete.generateWalletEntities = (message, wallets, isTitled = true) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        (isTitled ? "🐐 GoatBot | 網站\n" : "") +
        `${message} \n\n` +
        "══🔳 Your Wallets 🔳══\n\n";
    offset += header.length;
    const walletTexts = wallets.map((wallet, index) => {
        // Add entity for "Wallet_wX"
        entities.push({ offset: offset + 2, length: `Wallet_w${index + 1}`.length, type: 'bold' });
        entities.push({
            offset: offset + 2,
            length: `Wallet_w${index + 1}`.length,
            type: 'text_link',
            url: `https://etherscan.io/address/${wallet.address}`
        });
        offset += `▰ Wallet_w${index + 1} ▰\n\n`.length;
        const balanceText = `Bal: ${wallet.balance} ETH (${wallet.balance_in_dollar}) \- \n`;
        offset += balanceText.length;
        entities.push({ offset: offset, length: wallet.address.length, type: 'code' });
        offset += `${wallet.address}\`\n`.length;
        return `▰ Wallet_w${index + 1} ▰\n${balanceText} ${wallet.address}\n\n`;
    });
    const text = header + walletTexts.join('');
    return { text, entities };
};
ModernChineseMessageTemplete.generateExportWalletEntities = ({ wallets }) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | Website\n" +
        "使用所有 Telegram 機器人中最出色的 GOATBOT 提升您的加密貨幣交易 \n\n" +
        "══🔳 你的錢包 🔳══\n\n";
    offset += header.length;
    const walletTexts = wallets.map((wallet, index) => {
        // Add entity for "Wallet_wX"
        entities.push({ offset: offset + 2, length: `Wallet_w${index + 1}`.length, type: 'bold' });
        entities.push({
            offset: offset + 2,
            length: `Wallet_w${index + 1}`.length,
            type: 'text_link',
            url: `https://etherscan.io/address/${wallet.address}`
        });
        offset += `▰ Wallet_w${index + 1} ▰\n\n`.length;
        // Add entity for balance and transactions
        const balanceText = `Bal: ${wallet.balance} ETH\n`;
        offset += balanceText.length;
        // Add entity for wallet address (bold and text_link)
        entities.push({ offset: offset + " address: ".length, length: wallet.address.length, type: 'code' });
        offset += `Address: ${wallet.address}\`\n`.length;
        entities.push({ offset: offset + " private key: ".length, length: _a.decryptToken(wallet.private_key).length, type: 'code' });
        offset += `Private key: ${_a.decryptToken(wallet.private_key)}\`\n\n`.length;
        return `▰ Wallet_w${index + 1} ▰\n${balanceText}\n address: ${wallet.address}\n private key: ${_a.decryptToken(wallet.private_key)}\n\n`;
    });
    const text = header + walletTexts.join('');
    return { text, entities };
};
ModernChineseMessageTemplete.generateWalletBalanceEntities = ({ message = "使用 GOATBOT 提升您的加密貨幣交易——所有 Telegram 機器人中最出色的", balances }) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | 網站 | 教學\n" +
        `${message} \n\n` +
        "══🔳 Your Wallets 🔳══\n\n";
    offset += header.length;
    const walletTexts = balances.map((balance, index) => {
        var _b, _c, _d, _e;
        entities.push({ offset: offset + 2, length: `${balance.coin_name}`.length, type: 'bold' });
        entities.push({
            offset: offset + 2,
            length: `${balance.coin_name}`.length,
            type: 'text_link',
            url: `https://etherscan.io/address/${(_b = balance.contract_address) !== null && _b !== void 0 ? _b : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}`
        });
        offset += `▰ ${balance.coin_name} ▰\n\n`.length;
        // Add entity for balance and transactions
        const balanceText = `Bal: ${balance.balance} ${balance.coin_name} (${balance.balance_in_dollar}) \n \-`;
        offset += balanceText.length;
        // Add entity for wallet address (bold and text_link)
        entities.push({ offset: offset, length: (`${(_c = balance.contract_address) !== null && _c !== void 0 ? _c : "eth"}\n`).length, type: 'code' });
        offset += `${(_d = balance.contract_address) !== null && _d !== void 0 ? _d : "eth"}\n`.length;
        return `▰ ${balance.coin_name} ▰\n ${balanceText}${(_e = balance.contract_address) !== null && _e !== void 0 ? _e : "eth"}\n\n`;
    });
    if (walletTexts.length < 1) {
        walletTexts.push("你的錢包裡沒有代幣");
    }
    const text = header + walletTexts.join('');
    return { text, entities };
};
ModernChineseMessageTemplete.buyNotificationMessage = (user, data) => {
    let offset = 0;
    const entities = [];
    let text = "══════[ 🐐 GoatBot 🐐 ]══════\n\n";
    text += "address:  ";
    entities.push({
        offset: text.length,
        length: data.wallet.length,
        type: 'text_link',
        url: `https://etherscan.io/address/${data.wallet}`
    });
    text += data.wallet;
    text += "\n";
    text += "transaction hash : ";
    entities.push({
        offset: text.length,
        length: data.transactionHash.length,
        type: 'text_link',
        url: `https://etherscan.io/address/${data.transactionHash}`
    });
    text += data.transactionHash;
    text += "\n";
    text += "amount: ";
    text += data.amount;
    text += "\n";
    text += "transaction type: ";
    text += data.transactionType;
    text += "\n";
    return { text, entities, disable_web_page_preview: true };
};
exports.ModernChineseMessageTemplete = ModernChineseMessageTemplete;
class ModernChineseMessageEarnTemplate {
}
ModernChineseMessageEarnTemplate.generateReferalMessage = (user) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const entities = [];
    let text = "══════[🐐山羊機器人🐐]══════\n\n" +
        "在 GoatBot 上推出無縫推薦體驗！當您的朋友使用您的推薦加入時\n" +
        "代碼，你們倆都賺取 1 $GOAT。要解鎖此獎金，請確保您的錢包中持有 4 個 GOAT 代幣\n" +
        "每位推薦用戶可享 30 天。今天就開始推薦並累積 $GOAT!\n\n" +
        "參與 goatbot 推薦計畫🤝。推薦、賺取、持有 $GOAT 並領取您的收入。\n\n" +
        "══🔳您的推薦資訊🔳══\n\n" +
        "推薦碼: " + ((_c = (_b = user === null || user === void 0 ? void 0 : user.referal) === null || _b === void 0 ? void 0 : _b.referalCode) !== null && _c !== void 0 ? _c : "code") + "\n\n";
    entities.push({
        offset: text.length - (((_f = ((_e = (_d = user === null || user === void 0 ? void 0 : user.referal) === null || _d === void 0 ? void 0 : _d.referalCode) !== null && _e !== void 0 ? _e : "code")) === null || _f === void 0 ? void 0 : _f.length) + 2),
        length: ((_h = (_g = user === null || user === void 0 ? void 0 : user.referal) === null || _g === void 0 ? void 0 : _g.referalCode) !== null && _h !== void 0 ? _h : "code").length,
        type: 'code',
    });
    text +=
        "總推薦數: " + ((_k = (_j = user === null || user === void 0 ? void 0 : user.referal) === null || _j === void 0 ? void 0 : _j.totalEarnings) !== null && _k !== void 0 ? _k : 0) + " \n\n" +
            "總收入: " + ((_m = (_l = user === null || user === void 0 ? void 0 : user.referal) === null || _l === void 0 ? void 0 : _l.totalEarnings) !== null && _m !== void 0 ? _m : 0) + " $Goat \n\n" +
            "可索取的收入: " + ((_p = (_o = user === null || user === void 0 ? void 0 : user.referal) === null || _o === void 0 ? void 0 : _o.claimableEarnings) !== null && _p !== void 0 ? _p : 0) + " $Goat \n\n";
    return { text, entities };
};
exports.ModernChineseMessageEarnTemplate = ModernChineseMessageEarnTemplate;
