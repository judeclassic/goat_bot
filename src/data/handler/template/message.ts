import { IUser, IWallet } from "../../repository/database/models/user";

export class MessageTemplete {
    static defaultDollarToEth = 1608;
    static welcome = ({ wallets }:{ wallets: IUser['wallets']}) => (
        
`

-------------------------------------------------------------------------
🦄 Goatbot 🦄

═══ Your Wallets ═══
${wallets.map((wallet, index) => 
    `
▰ Wallet-w${index} ▰
Bal: ${wallet.balance} ETH (${this.defaultDollarToEth * wallet.balance}) - Txs: 0
${wallet.address}
`
)}
-------------------------------------------------------------------------
`)

    static trade = ({ wallets }:{ wallets: IUser['wallets']}) => (
        
`

-------------------------------------------------------------------------
Gas: 31   ═   Block: 18092846   ═   ETH: $${this.defaultDollarToEth}

═══ Your Wallets ═══
${wallets.map((wallet, index) => 
    `
▰ Wallet-w${index} ▰
Bal: ${wallet.balance} ETH (${this.defaultDollarToEth * wallet.balance}) - Txs: 0
${wallet.address}
`
)}
-------------------------------------------------------------------------
`)

}
export class MessageTradeTemplete {
    static defaultDollarToEth = 1608;
    static marketBuyWalletAddress = ({ wallets }:{ wallets: IUser['wallets']}) => (
    
`
-------------------------------------------------------------------------
🦄 Goatbot 🦄

═══ Select Wallets ═══
Select the address perform a market sell from
-------------------------------------------------------------------------
`)

    static marketSellWalletAddress = ({ wallets }:{ wallets: IUser['wallets']}) => (
    
`
-------------------------------------------------------------------------
🦄 Goatbot 🦄

═══ Select Wallets ═══
Select the address perform a market buy from
-------------------------------------------------------------------------
`)

    static limitBuyWalletAddress = ({ wallets }:{ wallets: IUser['wallets']}) => (
    
`
-------------------------------------------------------------------------
🦄 Goatbot 🦄

═══ Select Wallets ═══
Select the address perform a market sell from
-------------------------------------------------------------------------
`)

    static limitSellWalletAddress = ({ wallets }:{ wallets: IUser['wallets']}) => (
    
`
-------------------------------------------------------------------------
🦄 Goatbot 🦄

═══ Select Wallets ═══
Select the address perform a market buy from
-------------------------------------------------------------------------
`)

    static viewTransactionHistory = ({ wallets }:{ wallets: IUser['wallets']}) => (
    
`
-------------------------------------------------------------------------
🦄 Goatbot 🦄

═══ Select Wallets ═══
Select the address to view transaction history
-------------------------------------------------------------------------
`)

}





export class MessageWalletTemplete {
    
    
    static createANewWallet = ({ wallets }:{ wallets: IUser['wallets']}) => (
        `
        
        -------------------------------------------------------------------------
        🦄 Goatbot 🦄
        Click on "Add New" to create a new wallet
        -------------------------------------------------------------------------
        `)
        
        static importAWallet = ({ wallets }:{ wallets: IUser['wallets']}) => (
            `
            
            -------------------------------------------------------------------------
            🦄 Goatbot 🦄
            Enter the wallet private key and send to add wallet
            -------------------------------------------------------------------------
            `)
    static exportWallet = ({ wallets }:{ wallets: IUser['wallets']}) => (
    
`

-------------------------------------------------------------------------

═══ Your Exported Wallets ═══
${wallets.map((wallet, index) => 
`
▰ Wallet-w${index} ▰

Address: ${wallet.address}

Private Key: ${wallet.private_key}
`
)}
-------------------------------------------------------------------------
`)
            
    static selectWalletToExport = ({ wallets }:{ wallets: IUser['wallets']}) => (
`
-------------------------------------------------------------------------
🦄 Goatbot 🦄
Enter the wallet private key and send to add wallet
-------------------------------------------------------------------------
`)

    static removeAWallet = ({ wallets }:{ wallets: IUser['wallets']}) => (
`

-------------------------------------------------------------------------
🦄 Goatbot 🦄
Select the wallet to remove
-------------------------------------------------------------------------
`)

    static removeAWalletConfirm = ({ wallet }:{ wallet: IWallet}) => (
`

-------------------------------------------------------------------------
🦄 Goatbot 🦄
Click on "confirm" if you really want to remove this wallet ${wallet.address}
-------------------------------------------------------------------------
`)





}