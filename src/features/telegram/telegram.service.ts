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

    userOpensChat = async ( { telegram_id }:{ telegram_id: string } ) => {

        const user = await this.userModel.findOne({ telegram_id });
        if (!user) {
            const wallets = [await this.walletRepository.createWallet()]

            const createdUser = await this.userModel.create({ telegram_id, wallets });
            if (!createdUser) return { status: false, message: 'unable to create your account' };

            return {status: true, user: createdUser };
        }

        // const wallets: IWallet[] = [];

        // for (let i = 0; i < (user.wallets.length); i++) {
        //     console.log(wallets);
        //     user.wallets.push(await this.walletRepository.getWallet(user.wallets[i]));
        // }

        return { status: true, user };
    }

    userAddsWallet = async ( { telegram_id }:{ telegram_id: string } ) => {

        const user = await this.userModel.findOne({ telegram_id });
        if (!user) {
            const wallets = [await this.walletRepository.createWallet()]

            const createdUser = await this.userModel.create({ telegram_id, wallets });
            if (!createdUser) return { status: false, message: 'unable to create your account' };
            return {status: false, message: 'unable to send ' };
        }

        for (let i = 0; i < (user.wallets.length); i++) {
            user.wallets.push(await this.walletRepository.getWallet(user.wallets[i]));
        }
        user.wallets.push(await this.walletRepository.createWallet())

        return { status: true, user };
    }

}

export default TelegramService;