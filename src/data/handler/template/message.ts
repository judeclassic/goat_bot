import { IOtherWallet, IUser, IWallet } from "../../repository/database/models/user";
const etherscanBaseUrl = "https://etherscan.io/address/";

export class MessageTemplete {

    static welcome = () => (
        "══════[ 🐐 GoatBot 🐐 ]══════\n"+
        "🎉 Congrats on finding the G.O.A.T (Greatest Of All Telegram) Crypto bot! We're here to turbocharge your crypto journey.\n\n"+
        
        "📖 Quick Guide:\n\n"+
        "1. Wallet Hub 📔: Your crypto command center! View, Create, import, manage wallets, send/receive & peek at those 💰 balances.\n\n"+
        "2. Trading 📈: Dive into the financial oceans! Market Buy 🛍 & sell 🏷, Limit Buy 🛍 & sell 🏷, and keep a hawk's 👁 on your trades.\n\n"+
        "3. Bot Center 🤖: Automate like a pro! Sniper 🎯, frontrunner 🏃, mirror 🪞 bots & beyond.\n\n"+
        "4. Earning 🌱: Grow your seeds into mighty oaks! Dive into referrals 🤝 & stake your claim 🏰.\n\n"+
        "5. Settings ⚙️: Tailor GoatBot in your style! Customize, tweak, and make it truly yours.\n"
    );

    static defaultMessage = (message: string) => (
        "══════[ 🐐 GoatBot 🐐 ]══════\n"+
        ` ${message}\n`+
        "_______________________________________________\n"
    )

    static generateWalletEntities = (message: string, wallets: IUser['wallets']) => {
        let offset = 0;
        const entities: any = [];
    
        const header = 
            "══════[ 🐐 GoatBot 🐐 ]══════\n\n"+
            "🐐 GoatBot | Website\n"+
            `${message} \n\n` +
            "══🔳 Your Wallets 🔳══\n\n"
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

    static generateExportWalletEntities = ({ wallets }:{ wallets: IUser['wallets']}) => {
        let offset = 0;
        const entities: any = [];
    
        const header = 
            "══════[ 🐐 GoatBot 🐐 ]══════\n\n"+
            "🐐 GoatBot | Website\n"+
            "Elevate Your Crypto Trades with GOATBOT Greatest Of All Telegram Bots \n\n"+
            "══🔳 Your Wallets 🔳══\n\n"
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
            entities.push({ offset: offset+" address: ".length, length: wallet.address.length, type: 'code' });
            offset += `address: ${wallet.address}\`\n`.length;

            entities.push({ offset: offset+" private key: ".length, length: wallet.private_key.length, type: 'code' });
            offset += `private key: ${wallet.private_key}\`\n`.length;
    
            return `▰ Wallet_w${index + 1} ▰\n${balanceText}\n address: ${wallet.address}\n private key: ${wallet.private_key}\n`;
        });
    
        const text = header + walletTexts.join('');
    
        return { text, entities };
    };

    static generateWalletBalanceEntities = (
        { message = "Elevate Your Crypto Trades with GOATBOT– Greatest Of All Telegram Bots",balances }:{ message?: string, balances: IOtherWallet[]}
    ) => {
        let offset = 0;
        const entities: any = [];
        
        const header = 
            "══════[ 🐐 GoatBot 🐐 ]══════\n\n"+
            "🐐 GoatBot | Website | Tutorials\n"+
            `${message} \n\n`+
            "══🔳 Your Wallets 🔳══\n\n"
        offset += header.length;

        console.log(balances);
    
        const walletTexts = balances.map((balance, index) => {
            // Add entity for "Wallet_wX"
            entities.push({ offset: offset + 2, length: `Wallet_w${index + 1}`.length, type: 'bold' });
            entities.push({
                offset: offset + 2,
                length: `Wallet_w${index + 1}`.length,
                type: 'text_link',
                url: `https://etherscan.io/address/${balance.contract_address ?? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}`
            });
            offset += `▰ Wallet_w${index + 1} ▰\n\n`.length;
    
            // Add entity for balance and transactions
            const balanceText = `Bal: ${balance.balance} ${balance.coin_name} (${balance.balance_in_dollar}) \- \n`;
            offset += balanceText.length;
    
            // Add entity for wallet address (bold and text_link)
            entities.push({ offset: offset, length: (balance.contract_address ?? "eth").length, type: 'code' });
            offset += `${balance.contract_address ?? "eth"}\`\n`.length;
    
            return `▰ Wallet_w${index + 1} ▰\n${balanceText}${balance.contract_address ?? "eth"}\n\n`;
        });

        if (walletTexts.length < 1) {
            walletTexts.push("You have no token in your wallet")
        }
    
        const text = header + walletTexts.join('');
    
        return { text, entities };
    };
}
export class MessageEarnTemplate {
    static generateReferalMessage = ({ user }:{user: IUser}) => {
        const entities: any = [];
    
        let text = 
            "══════[ 🐐 GoatBot 🐐 ]══════\n\n"+
            "Introducing a seamless referral experience on GoatBot! When your friends join using your referral \n"+
            "code, both of you earn 1 $GOAT. To unlock this bonus, ensure you hold 4 GOAT tokens in your wallet \n"+
            "for 30 days per referred user. Start referring and accumulating $GOAT today! \n\n"+
            "Dive into goatbot referral program🤝 . Refer, earn, hold $GOAT & claim your earnings. \n\n"+
            "══🔳 Your Referral Info 🔳══\n\n"+
            "Referral Code: "+(user?.referal?.referalCode ?? "code")+"<\n\n";

        entities.push({
            offset: text.length - ((user?.referal?.referalCode ?? "code")?.length + 3),
            length: (user?.referal?.referalCode ?? "code").length,
            type: 'code',
        });
        
        text += 
            "Total Referrals: "+(user?.referal?.totalEarnings ?? 0)+" <\n\n"+
            "Total Earnings: "+(user?.referal?.totalEarnings ?? 0)+" $Goat <\n\n"+
            "Claimable Earnings: "+(user?.referal?.claimableEarnings ?? 0)+" $Goat <\n\n";
    
        return { text, entities };
    }
}