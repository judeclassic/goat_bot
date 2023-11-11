import IResponse from "../../../data/types/response/response";
import IntegrationService from "./integration.service";


class IntegrationController {
    private _integrationService: IntegrationService;
    
    constructor({ integrationService} : { integrationService : IntegrationService}) {
        this._integrationService = integrationService;
    }

    getGasPrices = async (
        _: any,
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.getGasPrices();
        if (!response.data) return sendResponse(401, { error: [{ message: response.error }], status: false });

        sendResponse(200, { data: response, status: true });
    };

    getCoinByContractAddress = async (
        { query }: { query: { contract_address: string } },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const { contract_address } = query;

        const response = await this._integrationService.getCoinByContractAddress({ contract_address });
        if (!response) return sendResponse(401, { error: response, status: false });

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

    limitBuyCoin = async (
        { body }: { body: any },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.limitBuy(body);
        if (!response) return sendResponse(401, { error: [{ message: response }], status: false });

        sendResponse(200, { data: response, status: true });
    };

    limitSellCoin = async (
        { body }: { body: any },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.limitSell(body);
        if (!response) return sendResponse(401, { error: [{ message: response }], status: false });

        sendResponse(200, { data: response, status: true });
    };

    importWallet = async (
        { body }: { body: any },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.importWallet(body);
        if (!response.data) return sendResponse(401, { error: response.errors, status: false });

        sendResponse(200, { data: response, status: true });
    };

    transferEth = async (
        { body }: { body: any },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.transferEth(body);
        if (!response.data) return sendResponse(401, { error: response.errors, status: false });

        sendResponse(200, { data: response, status: true });
    };

    transferToken = async (
        { body }: { body: any },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        console.log(body);
        const response = await this._integrationService.transferToken(body);
        if (!response.data) return sendResponse(401, { error: response.errors, status: false });

        sendResponse(200, { data: response, status: true });
    };

    getBalance = async (
        { params }: { params: any },
        sendResponse: (code: number, response: IResponse<any>)=>void
    )  => {
        const response = await this._integrationService.getBalance(params.token);
        if (!response.data) return sendResponse(401, { error: response.errors, status: false });

        sendResponse(200, { data: response.data, status: true });
    };
}

export default IntegrationController;


// how to validate email?