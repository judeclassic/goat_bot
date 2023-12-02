import Web3 from "web3";
import CryptoAccount from 'send-crypto'
import { IOtherWallet, IWallet } from "../database/models/user";
import jwt from 'jsonwebtoken';
import TradeRepository from "./__trade";
export const YOUR_ANKR_PROVIDER_URL = 'https://rpc.ankr.com/eth/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';
export const ANKR_PROVIDER_URL = 'https://rpc.ankr.com/multichain/56ef8dc41ff3a0a8ad5b3247e1cff736b8e0d4c8bfd57aa6dbf43014f5ceae8f';

import { AnkrProvider } from '@ankr.com/ankr.js';
import ICallback from "../../types/callback/callback";
  
class WalletRepository {
    private provider: Web3;
    private ankrProvider: AnkrProvider;
    private tradeRepository: TradeRepository;

    constructor () {
        this.provider = new Web3(new Web3.providers.HttpProvider(YOUR_ANKR_PROVIDER_URL));
        this.ankrProvider = new AnkrProvider(ANKR_PROVIDER_URL);
        this.tradeRepository = new TradeRepository();
    }

    public encryptToken = (data: any) => {
        return jwt.sign(data, process.env.SECRET_ENCRYPTION_KEY!);
    }

    public decryptToken = (data: any): string => {
        return jwt.verify(data, process.env.SECRET_ENCRYPTION_KEY!) as string;
    }

    createWallet:() => Promise<IWallet| undefined> = async () => {
        try {
            const account = this.provider.eth.accounts.create();
            const balance = await this.ankrProvider.getAccountBalance({walletAddress: account.address});

            return {
                address: account.address,
                private_key: this.encryptToken(account.privateKey),
                balance: proximate(balance.assets.find((value) => value.tokenSymbol === "eth")?.balance ?? '0'),
                balance_in_dollar: proximate(balance.assets.find((value) => value.tokenSymbol === "eth")?.balanceUsd ?? '0'),
                others: []
            }
        } catch (err) {
            console.log("Error: ", err);
            return undefined;
        }
    }

    importWallet = async (privateKey: string): Promise<IWallet | undefined> => {
        try {
            console.log("privateKey: ", privateKey)
            const account = this.provider.eth.accounts.privateKeyToAccount(privateKey);
            const balance = await this.ankrProvider.getAccountBalance({walletAddress: account.address});
            console.log(account)

            return {
                address: account.address,
                private_key: this.encryptToken(account.privateKey),
                balance: proximate(balance.assets.find((value) => value.tokenSymbol === "eth")?.balance ?? '0'),
                balance_in_dollar: proximate(balance.assets.find((value) => value.tokenSymbol === "eth")?.balanceUsd ?? '0'),
                others: []
            }
        } catch (err) {
            return undefined;
        }
    }
      

    getOtherTokens = async (wallet: IWallet): Promise<IOtherWallet[]> => {
        try {
            const tokens = await this.ankrProvider.getAccountBalance({walletAddress: wallet.address, onlyWhitelisted: false});

            return tokens.assets.map((value) => ({
                    logo: value.thumbnail,
                    coin_name: value.tokenName,
                    coin_symbol: value.tokenSymbol,
                    constant_price: value.tokenPrice,
                    decimal: value.tokenDecimals,
                    contract_address: value.contractAddress,
                    balance: proximate(value.balance),
                    balance_in_dollar: proximate(value.balanceUsd)
                })) as IOtherWallet[]
        } catch (err) {
            return [];
        }
    }

    getWallet = async (wallet: IWallet): Promise<IWallet> => {
        try {
            const balance = await this.ankrProvider.getAccountBalance({ walletAddress: wallet.address });

            return {
                address: wallet.address,
                private_key: this.decryptToken(wallet.private_key),
                balance: proximate(balance.assets.find((value) => value.tokenSymbol === "ETH")?.balance ?? '0'),
                balance_in_dollar: proximate(balance.assets.find((value) => value.tokenSymbol === "ETH")?.balanceUsd ?? '0'),
                others: balance.assets.map((value) => ({
                    logo: value.thumbnail,
                    coin_name: value.tokenName,
                    contract_address: value.contractAddress,
                    constant_price: value.tokenPrice,
                    decimal: value.tokenDecimals,
                    balance: value.balance,
                    balance_in_dollar: value.balanceUsd
                })) as IOtherWallet[]
            }
        } catch (err) {
            return wallet;
        }
    }

    transferToken = async ({wallet, contract_address, reciever_address, amount} : {
        wallet: IWallet,
        contract_address: string,
        reciever_address: string,
        amount: number
    }, callback: (transaction: ICallback) => void) : Promise<{ data?: string; error?: string }> => {
        try {
            const privateKey = this.decryptToken(wallet.private_key);
            const account = new CryptoAccount(privateKey);

            const txHash = await account.send(reciever_address, amount, {
                type: "ERC20",
                address: contract_address,
            })
            .on("transactionHash", console.log)
            .on("confirmation", console.log);

            callback({
                transactionHash: txHash,
                wallet: wallet.address,
                transactionType: 'transfer',
                amount: amount
            });
            return { data: txHash };
        } catch (err) {
            return { error: 'Error unable process transaction' };
        }
    }

    transferEth = async ({wallet, reciever_address, amount}:{
        wallet: IWallet,
        reciever_address: string,
        amount: number
    }, callback: (transaction: ICallback) => void) : Promise<{ data?: string; error?: string }> => {
        try {
            const privateKey = this.decryptToken(wallet.private_key);
            const account = new CryptoAccount(privateKey);

            const txHash = await account.send(reciever_address, amount, "ETH")
                .on("transactionHash", console.log)
                .on("confirmation", console.log);
                
            callback({
                transactionHash: txHash,
                wallet: wallet.address,
                transactionType: 'transfer',
                amount: amount
            });
            return { data: txHash };
        } catch (err) {
            return { error: 'Error unable process transaction'};
        }
    }

    addTokensToWallet = async (contract_address: string) => {
        const abiResponse = await this.tradeRepository.getABI(contract_address);
        if (!abiResponse.abi) return { error: abiResponse.error };
    }
}

export default WalletRepository;

const proximate = (value: string) => {
    return parseFloat(value).toPrecision(5);
};