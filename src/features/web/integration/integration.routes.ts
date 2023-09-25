import { UserModel } from "../../../data/repository/database/models/user";
import RequestHandler from "../../../data/repository/server/router";
import TradeRepository from "../../../data/repository/wallet/trade";
import IntegrationController from "./integration.controller";
import IntegrationService from "./integration.service";
import IntegrationValidator from "./integration.validator";

const integrationUserRoutes = async ({router}: {router: RequestHandler}) => {
    const tradeRepository = new TradeRepository();

    const integrationService = new IntegrationService({ userModel: UserModel, tradeRepository });
    const integrationController = new IntegrationController({ integrationService});
    
    router.get('/getgasprices', integrationController.getGasPrices );
    router.get('/getlistoftoken', integrationController.getListOfTokensInWallet);
    router.postWithBody('/marketbuy', integrationController.buyCoin );
    router.postWithBody('/marketsell', integrationController.sellCoin );
}

export default integrationUserRoutes;