import { SessionMessage, SessionType } from '../../data/handler/type';
import { IWallet, UserModel } from '../../data/repository/database/models/user';
import WalletRepository from '../../data/repository/wallet/wallet';

class TelegramService {
    userModel: typeof UserModel
    walletRepository: WalletRepository;


    constructor({ userModel, walletRepository } : {
        userModel: typeof UserModel
        walletRepository: WalletRepository
    }) {
        this.userModel = userModel;
        this.walletRepository = walletRepository;

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