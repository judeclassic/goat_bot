import IResponse from "../../../data/types/response/response";
import IntegrationService from "./integration.service";
import IntegrationValidator from "./integration.validator";


class IntegrationController {
    private _integrationService: IntegrationService;
    
    constructor({ integrationService} : { integrationService : IntegrationService}) {
        this._integrationService = integrationService;
    }

    getGasPrices = async (
        { },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.getGasPrices();
        if (!response.data) return sendResponse(401, { error: [{ message: response.error }], status: false });

        sendResponse(200, { data: response, status: true });
    };

    getListOfTokensInWallet = async (
        { query }: { query: { user_id: string; wallet_address: string } },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const { user_id, wallet_address } = query;

        const response = await this._integrationService.getListOfTokensInWallet({ user_id, wallet_address });
        if (!response.data) return sendResponse(401, { error: response.error, status: false });

        sendResponse(200, { data: response, status: true });
    };

    buyCoin = async (
        { body }: { body: any },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.buyCoin(body);
        if (!response) return sendResponse(401, { error: [{ message: response }], status: false });

        sendResponse(200, { data: response, status: true });
    };

    sellCoin = async (
        { body }: { body: any },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.sellCoin(body);
        if (!response) return sendResponse(401, { error: response, status: false });

        sendResponse(200, { data: response, status: true });
    };
}

export default IntegrationController;


// how to validate email?