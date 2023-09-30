import { SessionMessage, SessionType } from '../../data/handler/type';
import { IOtherWallet, IWallet, UserModel } from '../../data/repository/database/models/user';
import EncryptionRepository from '../../data/repository/encryption';
import TradeRepository from '../../data/repository/wallet/trade';
import WalletRepository from '../../data/repository/wallet/wallet';

class TelegramService {
    userModel: typeof UserModel
    encryptionRepository: EncryptionRepository
    walletRepository: WalletRepository;
    tradeRepository: TradeRepository;


    constructor({ userModel, walletRepository, tradeRepository, encryptionRepository } : {
        userModel: typeof UserModel
        walletRepository: WalletRepository
        tradeRepository: TradeRepository;
        encryptionRepository: EncryptionRepository
    }) {
        this.userModel = userModel;
        this.walletRepository = walletRepository;
        this.tradeRepository = tradeRepository;
        this.encryptionRepository = encryptionRepository;

    }

    userOpensChat = async ( { telegram_id }: { telegram_id: string } ) => {
        try {
            const { user } = await this.getCurrentUser(telegram_id);
            if (!user) return { status: false, message: 'unable to get current user' };
            const wallets: IWallet[] = [];

            for (const element of user.wallets) {
                const wallet = await this.walletRepository.getWallet(element);
                wallets.push(wallet);
            }
            user.wallets = wallets;

            return { status: true, user };
        } catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

    userAddsWallet = async ( { telegram_id }: { telegram_id: string } ) => {
        try {
            const { user } = await this.getCurrentUser(telegram_id);
            if (!user) return { status: false, message: 'unable to get current user' };
            const wallets: IWallet[] = [];

            if (user.wallets.length >= 3) return { status: false, message: 'delete a wallet before adding one' };

            for (const element of user.wallets) {
                const wallet = await this.walletRepository.getWallet(element);
                wallets.push(wallet);
            }

            user.wallets = wallets;
            const wallet = await this.walletRepository.createWallet();
            if (!wallet) return { status: false, message: 'error please send "/start" request again' };
            user.wallets.push(wallet);
            await user.save()

            return { status: true, user };
        }catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

    generateUserIDToken = async ( { telegram_id }: { telegram_id: string } ) => {
        try {
            const { user } = await this.getCurrentUser(telegram_id);
            if (!user) return { status: false, message: 'unable to get current user' };

            const token = this.encryptionRepository.encryptToken({ telegram_id });

            return { status: true, token };
        }catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }
    userImportWallet = async ( { telegram_id, private_key }: { telegram_id: string, private_key: string } ) => {
        try {
            const { user } = await this.getCurrentUser(telegram_id);
            if (!user) return { status: false, message: 'unable to get current user' };

            if (!private_key) return { status: false, message: 'invalid private key' };

            const wallets: IWallet[] = [];
            for (const element of user.wallets) {
                const wallet = await this.walletRepository.getWallet(element);
                wallets.push(wallet);
            }
            user.wallets = wallets;
            const wallet = await this.walletRepository.importWallet(private_key);
            if (!wallet) return { status: false, message: 'invalid private key' };
            user.wallets.push(wallet)
            await user.save()

            return { status: true, user };
        }catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

    userDeleteWallet = async ({ telegram_id, wallet_number }: { telegram_id: string, wallet_number: number }) => {
        try {
            const { user } = await this.getCurrentUser(telegram_id);
            if (!user) return { status: false, message: 'unable to get current user' };

            const wallets: IWallet[] = [];
            for (const element of user.wallets) {
                if (user.wallets.indexOf(element) === wallet_number) continue;
                const wallet = await this.walletRepository.getWallet(element);
                wallets.push(wallet);
            }
            user.wallets = wallets;
            await user.save()

            return { status: true, user };
        }catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

    getGeneralBalance = async ({ telegram_id, wallet_number }: { telegram_id: string, wallet_number: number }) => {
        try {
            const { user } = await this.getCurrentUser(telegram_id);
            if (!user) return { status: false, message: 'unable to get current user' };

            const wallet = user.wallets[wallet_number]
            const balances = await this.tradeRepository.getListOfTokensInWallet({ wallet});

            if (balances.length === 0) {
                const _wallet = await this.walletRepository.getWallet(wallet);
                return {status: true, balances: [{
                    coin_name: 'Eth',
                    contract_address: '',
                    balance: _wallet.balance
                }] as IOtherWallet[]}
                
            }

            return { status: true, balances };
        }catch (err) {
            return { status: false, message: 'error please send "/start" request again' };
        }
    }

    getCurrentUser = async (telegram_id: string) => {
        const user = await this.userModel.findOne({ telegram_id });
        if (!user) {
            const wallets = [await this.walletRepository.createWallet()]

            const user = await this.userModel.create({ telegram_id, wallets });
            if (!user) return { message: 'unable to create your account' };
            return { user };
        }
        return { user };
    }

}

export default TelegramService;