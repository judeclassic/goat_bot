"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageWalletTemplete = exports.MessageTradeTemplete = exports.MessageTemplete = void 0;
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
    ` ${message}\n`);
MessageTemplete.generateWalletEntities = ({ wallets }) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | Website | Tutorials\n" +
        "Elevate Your Crypto Trades with GOATBOT– Greatest Of All Telegram Bots \n\n" +
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
        const balanceText = `Bal: ${wallet.balance} ETH (${_a.defaultDollarToEth * wallet.balance}) \- Txs: 0\n`;
        offset += balanceText.length;
        // Add entity for wallet address (bold and text_link)
        entities.push({ offset: offset, length: wallet.address.length, type: 'code' });
        offset += `${wallet.address}\`\n`.length;
        return `▰ Wallet_w${index + 1} ▰\n${balanceText} ${wallet.address}\n\n`;
    });
    const text = header + walletTexts.join('');
    return { text, entities };
};
exports.MessageTemplete = MessageTemplete;
class MessageTradeTemplete {
}
MessageTradeTemplete.defaultDollarToEth = 1608;
MessageTradeTemplete.welcome = () => ("________________________________________________\n\n" +
    "🦄 Goatbot 🦄\n\n" +
    "💹 Start Trading with GoatBot🦸‍♂️\n\n" +
    "1. 🟢 Buy Now 💸: Ready to expand your crypto portfolio? Dive in and acquire your desired cryptocurrency instantly with our smooth and straightforward buying process.\n\n" +
    "2. 🔴 Sell Now 💸: Got profits? Or just reshuffling your assets? Easily liquidate your holdings at current market rates. Profit-taking has never been this seamless!\n\n" +
    "3. 🟡 Limit Buy Order 🔒: Be the market ninja! 🥷 Set a price point at which you wish to purchase, and let GoatBot do the rest. We'll buy when the price is just right!\n\n" +
    "4. 🟠 Limit Sell Order 🔒: Secure your profits or limit losses! Decide on a selling price, and GoatBot will execute the trade when your set price is hit. Sleep easy, knowing you're in control.\n\n" +
    "5. 📜 View Transaction History 🔍: Curious about your past maneuvers? Take a stroll down memory lane and review all your trade activities, beautifully documented and easy to understand.\n\n" +
    "🌟 Trading made simple, effective, and fun, all at your fingertips!\n\n" +
    "________________________________________________");
MessageTradeTemplete.marketBuyWalletAddress = ({ wallets }) => (`
        ________________________________________________
        🦄 Goatbot 🦄

        ═══ Select Wallets ═══
        Select the address perform a market sell from
        ________________________________________________
        `);
MessageTradeTemplete.marketSellWalletAddress = ({ wallets }) => (`
        ________________________________________________
        🦄 Goatbot 🦄

        ═══ Select Wallets ═══
        Select the address perform a market buy from
        ________________________________________________
        `);
MessageTradeTemplete.limitBuyWalletAddress = ({ wallets }) => (`
        ________________________________________________
        🦄 Goatbot 🦄

        ═══ Select Wallets ═══
        Select the address perform a market sell from
        ________________________________________________
        `);
MessageTradeTemplete.limitSellWalletAddress = ({ wallets }) => (`
        ________________________________________________
        🦄 Goatbot 🦄

        ═══ Select Wallets ═══
        Select the address perform a market buy from
        ________________________________________________
        `);
MessageTradeTemplete.viewTransactionHistory = ({ wallets }) => (`
        ________________________________________________
        🦄 Goatbot 🦄

        ═══ Select Wallets ═══
        Select the address to view transaction history
        ________________________________________________
        `);
exports.MessageTradeTemplete = MessageTradeTemplete;
class MessageWalletTemplete {
}
_b = MessageWalletTemplete;
MessageWalletTemplete.defaultDollarToEth = 1608;
MessageWalletTemplete.createANewWallet = () => ("══════[ 🐐 GoatBot 🐐 ]══════\n" +
    " Click on 'Add New' to create a new wallet\n" +
    "_______________________________________________\n");
MessageWalletTemplete.importAWallet = () => ("══════[ 🐐 GoatBot 🐐 ]══════\n" +
    "Enter the wallet private key and send to add wallet\n" +
    "_______________________________________________\n");
MessageWalletTemplete.sendEtherium = () => ("══════[ 🐐 GoatBot 🐐 ]══════\n" +
    "Enter to send etherium\n" +
    "_______________________________________________\n");
MessageWalletTemplete.sendToken = () => ("══════[ 🐐 GoatBot 🐐 ]══════\n" +
    "Enter to send token\n" +
    "_______________________________________________\n");
MessageWalletTemplete.generateWalletEntities = ({ wallets }) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | Website | Tutorials\n" +
        "Elevate Your Crypto Trades with GOATBOT– Greatest Of All Telegram Bots \n\n" +
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
        const balanceText = `Bal: ${wallet.balance} ETH (${_b.defaultDollarToEth * wallet.balance}) \- Txs: 0\n`;
        offset += balanceText.length;
        // Add entity for wallet address (bold and text_link)
        entities.push({ offset: offset, length: wallet.address.length, type: 'code' });
        offset += `${wallet.address}\`\n`.length;
        return `▰ Wallet_w${index + 1} ▰\n${balanceText} ${wallet.address}\n\n`;
    });
    const text = header + walletTexts.join('');
    return { text, entities };
};
MessageWalletTemplete.generateExportWalletEntities = ({ wallets }) => {
    let offset = 0;
    const entities = [];
    const header = "══════[ 🐐 GoatBot 🐐 ]══════\n\n" +
        "🐐 GoatBot | Website | Tutorials\n" +
        "Elevate Your Crypto Trades with GOATBOT– Greatest Of All Telegram Bots \n\n" +
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
        const balanceText = `Bal: ${wallet.balance} ETH (${_b.defaultDollarToEth * wallet.balance}) \- Txs: 0\n`;
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
MessageWalletTemplete.generateWalletBalanceEntities = ({ balances }) => {
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
        const balanceText = `Bal: ${balance.balance} ${balance.coin_name} (${_b.defaultDollarToEth * balance.balance}) \- Txs: 0\n`;
        offset += balanceText.length;
        // Add entity for wallet address (bold and text_link)
        entities.push({ offset: offset, length: balance.contract_address.length, type: 'code' });
        offset += `${balance.contract_address}\`\n`.length;
        return `▰ Wallet_w${index + 1} ▰\n${balanceText}${balance.contract_address}\n\n`;
    });
    const text = header + walletTexts.join('');
    return { text, entities };
};
MessageWalletTemplete.selectWalletToExport = ({ wallets }) => (`
        ________________________________________________
        🦄 Goatbot 🦄
        Enter the wallet private key and send to add wallet
        ________________________________________________
        `);
MessageWalletTemplete.removeAWallet = ({ wallets }) => (`
        ________________________________________________
        🦄 Goatbot 🦄
        Select the wallet to remove
        ________________________________________________
        `);
MessageWalletTemplete.removeAWalletConfirm = ({ wallet }) => (`
        ________________________________________________
        🦄 Goatbot 🦄
        Click on "confirm" if you really want to remove this wallet ${wallet.address}
        ________________________________________________
        `);
exports.MessageWalletTemplete = MessageWalletTemplete;