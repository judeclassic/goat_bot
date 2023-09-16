import { UserModel } from "../../../data/repository/database/models/user";
import RequestHandler from "../../../data/repository/server/router";
import IntegrationController from "./integration.controller";
import IntegrationService from "./integration.service";
import IntegrationValidator from "./integration.validator";

const integrationUserRoutes = async ({router}: {router: RequestHandler}) => {
    const integrationValidator = new IntegrationValidator();

    const integrationService = new IntegrationService({ userModel: UserModel });
    const adminUserController = new IntegrationController({ integrationValidator, integrationService});
    
    // router.getWithAuth('/get-all-coin', adminUserController.getAllUsers );
    // router.postWithBodyAndAuth('/buy', adminUserController.banUser );
    // router.postWithBodyAndAuth('/sell', adminUserController.unbanUser );
}

export default integrationUserRoutes;