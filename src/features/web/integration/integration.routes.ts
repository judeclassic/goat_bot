import { UserModel as userModel } from "../../../data/repository/database/models/user";
import EncryptionRepository from "../../../data/repository/encryption";
import RequestHandler from "../../../data/repository/server/router";
import TradeRepository from "../../../data/repository/wallet/trade";
import WalletRepository from "../../../data/repository/wallet/wallet";
import IntegrationController from "./integration.controller";
import IntegrationService from "./integration.service";
import { LimitMarketModel as limitMarketModel } from "../../../data/repository/database/models/limit";

const integrationUserRoutes = async ({router}: {router: RequestHandler}) => {
    const tradeRepository = new TradeRepository();
    const walletRepository = new WalletRepository();
    const encryptionRepository = new EncryptionRepository();

    const integrationService = new IntegrationService({ userModel, tradeRepository, encryptionRepository, walletRepository, limitMarketModel });
    const integrationController = new IntegrationController({ integrationService});
    
    router.get('/getgasprices', integrationController.getGasPrices);
    router.get('/getlistoftoken', integrationController.getListOfTokensInWallet);

    router.get('/get-token-by-contract', integrationController.getCoinByContractAddress);

    router.postWithBody('/marketbuy', integrationController.buyCoin);
    router.postWithBody('/marketsell', integrationController.sellCoin);

    router.postWithBody('/limitbuy', integrationController.limitBuyCoin);
    router.postWithBody('/limitsell', integrationController.limitSellCoin);

    router.postWithBody('/import_wallet', integrationController.importWallet);
    router.get('/get_balance/:token', integrationController.getBalance);

    router.postWithBody('/send_tokens', integrationController.transferToken);
    router.postWithBody('/send_eth', integrationController.transferEth);
    
}

export default integrationUserRoutes;