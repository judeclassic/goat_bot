import { IUser } from "../../repository/database/models/user";

export class MessageTemplete {
    static defaultDollarToEth = 1608;
    static welcome = ({ wallets }:{ wallets: IUser['wallets']}) => (
        
`

-------------------------------------------------------------------------
Gas: 31   ═   Block: 18092846   ═   ETH: $${this.defaultDollarToEth}
Welcome to Goatbot. You are now registered and have been assigned new wallets. Fund the wallets provided to start swapping and sniping.

🦄 Goatbot ⬩ Website ⬩ Tutorials 🦄
Snipe & trade at elite speeds for free. Ethereum and Basechain is supported.

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