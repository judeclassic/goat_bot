"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEarnTemplate = exports.MessageTemplete = void 0;
const etherscanBaseUrl = "https://etherscan.io/address/";
class MessageTemplete {
}
_a = MessageTemplete;
MessageTemplete.defaultDollarToEth = 1608;
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
MessageTemplete.generateWalletEntities = (message, wallets) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | Website\n" +
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
        const balanceText = `Bal: ${wallet.balance} ETH (${_a.defaultDollarToEth * wallet.balance}) \- Txs: 0\n`;
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
        offset += `address: ${wallet.address}\`\n`.length;
        entities.push({ offset: offset + " private key: ".length, length: wallet.private_key.length, type: 'code' });
        offset += `private key: ${wallet.private_key}\`\n`.length;
        return `▰ Wallet_w${index + 1} ▰\n${balanceText}\n address: ${wallet.address}\n private key: ${wallet.private_key}\n`;
    });
    const text = header + walletTexts.join('');
    return { text, entities };
};
MessageTemplete.generateWalletBalanceEntities = ({ balances }) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | Website | Tutorials\n" +
        "Elevate Your Crypto Trades with GOATBOT– Greatest Of All Telegram Bots \n\n" +
        "══🔳 Your Wallets 🔳══\n\n";
    offset += header.length;
    const walletTexts = balances.map((balance, index) => {
        // Add entity for "Wallet_wX"
        entities.push({ offset: offset + 2, length: `Wallet_w${index + 1}`.length, type: 'bold' });
        entities.push({
            offset: offset + 2,
            length: `Wallet_w${index + 1}`.length,
            type: 'text_link',
            url: `https://etherscan.io/address/${balance.contract_address}`
        });
        offset += `▰ Wallet_w${index + 1} ▰\n\n`.length;
        // Add entity for balance and transactions
        const balanceText = `Bal: ${balance.balance} ${balance.coin_name} (${_a.defaultDollarToEth * balance.balance}) \- Txs: 0\n`;
        offset += balanceText.length;
        // Add entity for wallet address (bold and text_link)
        entities.push({ offset: offset, length: balance.contract_address.length, type: 'code' });
        offset += `${balance.contract_address}\`\n`.length;
        return `▰ Wallet_w${index + 1} ▰\n${balanceText}${balance.contract_address}\n\n`;
    });
    const text = header + walletTexts.join('');
    return { text, entities };
};
exports.MessageTemplete = MessageTemplete;
class MessageEarnTemplate {
}
MessageEarnTemplate.generateReferalMessage = ({ user }) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const entities = [];
    let text = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "Introducing a seamless referral experience on GoatBot! When your friends join using your referral \n" +
        "code, both of you earn 1 $GOAT. To unlock this bonus, ensure you hold 4 GOAT tokens in your wallet \n" +
        "for 30 days per referred user. Start referring and accumulating $GOAT today! \n\n" +
        "Dive into goatbot referral program🤝 . Refer, earn, hold $GOAT & claim your earnings. \n\n" +
        "══🔳 Your Referral Info 🔳══\n\n" +
        "Referral Code: " + ((_c = (_b = user === null || user === void 0 ? void 0 : user.referal) === null || _b === void 0 ? void 0 : _b.referalCode) !== null && _c !== void 0 ? _c : "code") + "<\n\n";
    entities.push({
        offset: text.length - (((_f = ((_e = (_d = user === null || user === void 0 ? void 0 : user.referal) === null || _d === void 0 ? void 0 : _d.referalCode) !== null && _e !== void 0 ? _e : "code")) === null || _f === void 0 ? void 0 : _f.length) + 3),
        length: ((_h = (_g = user === null || user === void 0 ? void 0 : user.referal) === null || _g === void 0 ? void 0 : _g.referalCode) !== null && _h !== void 0 ? _h : "code").length,
        type: 'code',
    });
    text +=
        "Total Referrals: " + ((_k = (_j = user === null || user === void 0 ? void 0 : user.referal) === null || _j === void 0 ? void 0 : _j.totalEarnings) !== null && _k !== void 0 ? _k : 0) + " <\n\n" +
            "Total Earnings: " + ((_m = (_l = user === null || user === void 0 ? void 0 : user.referal) === null || _l === void 0 ? void 0 : _l.totalEarnings) !== null && _m !== void 0 ? _m : 0) + " $Goat <\n\n" +
            "Claimable Earnings: " + ((_p = (_o = user === null || user === void 0 ? void 0 : user.referal) === null || _o === void 0 ? void 0 : _o.claimableEarnings) !== null && _p !== void 0 ? _p : 0) + " $Goat <\n\n";
    return { text, entities };
};
exports.MessageEarnTemplate = MessageEarnTemplate;
