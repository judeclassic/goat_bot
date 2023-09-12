import CryptoAccount, { newPrivateKey } from "send-crypto";
import { IWallet } from "../database/models/user";

class WalletRepository {
    createWallet:() => Promise<IWallet> = async () => {
        try {
            const privateKey = newPrivateKey()
            const account = new CryptoAccount(privateKey);

            return {
                address: await account.address('ETH'),
                private_key: privateKey,
                balance: 0,
            }
        } catch (err) {
            return await this.createWallet();
        }
    }

    getWallet:(wallet: IWallet) => Promise<IWallet> = async (wallet: IWallet) => {
        try {
            const account = new CryptoAccount(wallet.private_key);

            return {
                address: wallet.address,
                private_key: wallet.private_key,
                balance: await account.getBalance('ETH'),
            }
        } catch (err) {
            return {
                private_key: wallet.private_key,
                address: wallet.address,
                balance: wallet.balance
            }
        }
    }

    sendCrypto = () => {}
}

export default WalletRepository;