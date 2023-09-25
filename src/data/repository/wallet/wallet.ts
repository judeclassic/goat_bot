import Web3 from "web3";
import { IWallet } from "../database/models/user";
import TradeRepository from "./trade";
const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f' 
  
class WalletRepository {
    private provider: Web3;
    private tradeRepository: TradeRepository;

    constructor () {
        this.provider = new Web3(new Web3.providers.HttpProvider(YOUR_ANKR_PROVIDER_URL));
        this.tradeRepository = new TradeRepository();
    }
    createWallet:() => Promise<IWallet| undefined> = async () => {
        try {
            const account = this.provider.eth.accounts.create();

            return {
                address: account.address,
                private_key: account.privateKey,
                balance: 0,
                others: []
            }
        } catch (err) {
            return undefined;
        }
    }

    importWallet = async (privateKey: string): Promise<IWallet | undefined> => {
        try {
            const account = this.provider.eth.accounts.privateKeyToAccount(privateKey);

            return {
                address: account.address,
                private_key: account.privateKey,
                balance: parseFloat((await this.provider.eth.getBalance(account.address)).toString()),
                others: []
            }
        } catch (err) {
            return undefined;
        }
    }

    getWallet = async (wallet: IWallet): Promise<IWallet> => {
        try {
            const account = this.provider.eth.accounts.privateKeyToAccount(wallet.private_key);

            return {
                address: account.address,
                private_key: account.privateKey,
                balance: parseFloat((await this.provider.eth.getBalance(account.address)).toString()),
                others: wallet.others.map((wallet) => wallet)
            }
        } catch (err) {
            return wallet;
        }
    }

    addTokensToWallet = async (contract_address: string) => {
        const abiResponse = await this.tradeRepository.getABI(contract_address);
        if (!abiResponse.abi) return { error: abiResponse.error };

    }
}

export default WalletRepository;