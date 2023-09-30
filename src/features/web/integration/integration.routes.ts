import { UserModel } from "../../../data/repository/database/models/user";
import EncryptionRepository from "../../../data/repository/encryption";
import RequestHandler from "../../../data/repository/server/router";
import TradeRepository from "../../../data/repository/wallet/trade";
import WalletRepository from "../../../data/repository/wallet/wallet";
import IntegrationController from "./integration.controller";
import IntegrationService from "./integration.service";
import IntegrationValidator from "./integration.validator";

const integrationUserRoutes = async ({router}: {router: RequestHandler}) => {
    const tradeRepository = new TradeRepository();
    const walletRepository = new WalletRepository();
    const encryptionRepository = new EncryptionRepository();

    const integrationService = new IntegrationService({ userModel: UserModel, tradeRepository, encryptionRepository, walletRepository });
    const integrationController = new IntegrationController({ integrationService});
    
    router.get('/getgasprices', integrationController.getGasPrices );
    router.get('/getlistoftoken', integrationController.getListOfTokensInWallet);
    router.postWithBody('/marketbuy', integrationController.buyCoin );
    router.postWithBody('/marketsell', integrationController.sellCoin );
    router.postWithBody('/import_wallet', integrationController.importWallet );
}

export default integrationUserRoutes;