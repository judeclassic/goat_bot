import { UserModel as userModel } from "../../../data/repository/database/models/user";
import EncryptionRepository from "../../../data/repository/encryption";
import RequestHandler from "../../../data/repository/server/router";
import TradeRepository from "../../../data/repository/wallet/trade";
import WalletRepository from "../../../data/repository/wallet/wallet";
import { LimitMarketModel as limitMarketModel } from "../../../data/repository/database/models/limit";
import OtherController from "./other.controller";
import OtherService from "./other.service";

const otherUserRoutes = async ({router}: {router: RequestHandler}) => {
    const tradeRepository = new TradeRepository();
    const walletRepository = new WalletRepository();
    const encryptionRepository = new EncryptionRepository();

    const otherService = new OtherService({ userModel, tradeRepository, encryptionRepository, walletRepository, limitMarketModel });
    const otherController = new OtherController({ otherService});
    
    router.postWithBody('/referral_code', otherController.addReferralCode);
    
}

export default otherUserRoutes;