import IResponse from "../../../data/types/response/response";
import IntegrationService from "./integration.service";
import IntegrationValidator from "./integration.validator";


class IntegrationController {
    private _integrationService: IntegrationService;
    private _integrationValidator: IntegrationValidator;
    
    constructor({ integrationValidator, integrationService} : { integrationValidator: IntegrationValidator, integrationService : IntegrationService}) {
        this._integrationValidator = integrationValidator;
        this._integrationService = integrationService;
    }

    // getAllUsers = async (
    //     { query }: { query: { page: number; limit: number } },
    //     sendResponse: (code: number, response: IResponse<IMultipleUserSecureResponse>)=>void
    // )  => {
    //     const validationErrors = this._authValidator.validateLimitOption(query);
    //     if (validationErrors.length > 0) return sendResponse(400, { error: validationErrors, status: false });
    
    //     const response = await this._userService.getAllUsers(query);
    //     if (!response.users) return sendResponse(401, { error: response.errors, status: false });
  
    //     sendResponse(200, { data: response.users.getSecureResponse, status: true });
    // }

    // banUser = async (
    //     {body}: {body: { userId: string }},
    //     sendResponse: (code: number, response: IResponse<IAdminSecureResponse>)=>void
    // )  => {
    //     const validationErrors = this._authValidator.validateUserId(body.userId);
    //     if (validationErrors.length > 0) return sendResponse(400, { error: validationErrors, status: false });

    //     const response = await this._userService.banUser(body.userId);
    //     if (!response.user) return sendResponse(403, { status: false, error: response.errors });
  
    //     return sendResponse(200, { status: true, data: response.user });
    // }

    // unbanUser = async (
    //     { body } : { body: { userId: string }},
    //     sendResponse: (code: number, response: IResponse<IAdminSecureResponse>)=>void
    // )  => {
    //     const validationErrors = this._authValidator.validateUserId(body.userId);
    //     if (validationErrors.length > 0) return sendResponse(400, { error: validationErrors, status: false });

    //     const response = await this._userService.banUser(body.userId);
    //     if (!response.user) return sendResponse(403, { status: false, error: response.errors });
  
    //     return sendResponse(200, { status: true, data: response.user });
    // }
}

export default IntegrationController;


// how to validate email?