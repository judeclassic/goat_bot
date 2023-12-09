"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEarnTemplate = exports.MessageTemplete = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class MessageTemplete {
}
_a = MessageTemplete;
MessageTemplete.decryptToken = (data) => {
    return jsonwebtoken_1.default.verify(data, process.env.SECRET_ENCRYPTION_KEY);
};
MessageTemplete.welcome = () => ("══════[ 🐐 GoatBot 🐐 ]══════\n" +
    "🎉 Congrats on finding the G.O.A.T (Greatest Of All Telegram) Crypto bot! We're here to turbocharge your crypto journey.\n\n" +
    "📖 Quick Guide:\n\n" +
    "1. Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances.\n\n" +
    "2. Trading 📈: Dive into the financial oceans! Market Buy 🛍 & sell 🏷, Limit Buy 🛍 & sell 🏷, and keep a hawk's 👁 on your trades.\n\n" +
    "3. Bot Center 🤖: Automate like a pro! Sniper 🎯, frontrunner 🏃, mirror 🪞 bots & beyond.\n\n" +
    "4. Earning 🌱: Grow your seeds into mighty oaks! Dive into referrals 🤝 & stake your claim 🏰.\n\n" +
    "5. Settings ⚙️: Tailor GoatBot in your style! Customize, tweak, and make it truly yours.\n");
MessageTemplete.defaultMessage = (message) => ("══════[ 🐐 GoatBot 🐐 ]══════\n" +
    ` ${message}\n` +
    "_______________________________________________\n");
MessageTemplete.generateWalletEntities = (message, wallets, isTitled = true) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        (isTitled ? "🐐 GoatBot | Website\n" : "") +
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
MessageTemplete.generateExportWalletEntities = ({ wallets }) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | Website\n" +
        "Elevate Your Crypto Trades with GOATBOT Greatest Of All Telegram Bots \n\n" +
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
MessageTemplete.generateWalletBalanceEntities = ({ message = "Elevate Your Crypto Trades with GOATBOT– Greatest Of All Telegram Bots", balances }) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | Website | Tutorials\n" +
        `${message} \n\n` +
        "══🔳 Your Wallets 🔳══\n\n";
    offset += header.length;
    const walletTexts = balances.map((balance, index) => {
        var _b, _c, _d, _e;
        // Add entity for "Wallet_wX"
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
        walletTexts.push("You have no token in your wallet");
    }
    const text = header + walletTexts.join('');
    return { text, entities };
};
MessageTemplete.buyNotificationMessage = (user, data) => {
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
exports.MessageTemplete = MessageTemplete;
class MessageEarnTemplate {
}
MessageEarnTemplate.generateReferalMessage = (user) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const entities = [];
    let text = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "Introducing a seamless referral experience on GoatBot! When your friends join using your referral \n" +
        "code, both of you earn 1 $GOAT. To unlock this bonus, ensure you hold 4 GOAT tokens in your wallet \n" +
        "for 30 days per referred user. Start referring and accumulating $GOAT today! \n\n" +
        "Dive into goatbot referral program🤝 . Refer, earn, hold $GOAT & claim your earnings. \n\n" +
        "══🔳 Your Referral Info 🔳══\n\n" +
        "Referral Code: " + ((_c = (_b = user === null || user === void 0 ? void 0 : user.referal) === null || _b === void 0 ? void 0 : _b.referalCode) !== null && _c !== void 0 ? _c : "code") + "\n\n";
    entities.push({
        offset: text.length - (((_f = ((_e = (_d = user === null || user === void 0 ? void 0 : user.referal) === null || _d === void 0 ? void 0 : _d.referalCode) !== null && _e !== void 0 ? _e : "code")) === null || _f === void 0 ? void 0 : _f.length) + 2),
        length: ((_h = (_g = user === null || user === void 0 ? void 0 : user.referal) === null || _g === void 0 ? void 0 : _g.referalCode) !== null && _h !== void 0 ? _h : "code").length,
        type: 'code',
    });
    text +=
        "Total Referrals: " + ((_k = (_j = user === null || user === void 0 ? void 0 : user.referal) === null || _j === void 0 ? void 0 : _j.totalEarnings) !== null && _k !== void 0 ? _k : 0) + " \n\n" +
            "Total Earnings: " + ((_m = (_l = user === null || user === void 0 ? void 0 : user.referal) === null || _l === void 0 ? void 0 : _l.totalEarnings) !== null && _m !== void 0 ? _m : 0) + " $Goat \n\n" +
            "Claimable Earnings: " + ((_p = (_o = user === null || user === void 0 ? void 0 : user.referal) === null || _o === void 0 ? void 0 : _o.claimableEarnings) !== null && _p !== void 0 ? _p : 0) + " $Goat \n\n";
    return { text, entities };
};
exports.MessageEarnTemplate = MessageEarnTemplate;
