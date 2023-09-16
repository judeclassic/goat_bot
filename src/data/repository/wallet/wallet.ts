import Web3 from "web3";
import { IWallet } from "../database/models/user";
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f' 


class WalletRepository {
    private provider: Web3;

    constructor () {
        this.provider = new Web3(new Web3.providers.HttpProvider(YOUR_ANKR_PROVIDER_URL));
    }
    createWallet:() => Promise<IWallet| undefined> = async () => {
        try {
            const account = this.provider.eth.accounts.create();

            return {
                address: account.address,
                private_key: account.privateKey,
                balance: 0,
            }
        } catch (err) {
            return undefined;
        }
    }

    importWallet:(privateKey: string) => Promise<IWallet | undefined> = async (privateKey: string) => {
        try {
            const account = this.provider.eth.accounts.privateKeyToAccount(privateKey);

            return {
                address: account.address,
                private_key: account.privateKey,
                balance: parseFloat((await this.provider.eth.getBalance(account.address)).toString()),
            }
        } catch (err) {
            return undefined;
        }
    }

    getWallet:(wallet: IWallet) => Promise<IWallet> = async (wallet: IWallet) => {
        try {
            const account = this.provider.eth.accounts.privateKeyToAccount(wallet.private_key);

            return {
                address: account.address,
                private_key: account.privateKey,
                balance: parseFloat((await this.provider.eth.getBalance(account.address)).toString()),
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