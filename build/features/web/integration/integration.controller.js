"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class IntegrationController {
    constructor({ integrationService }) {
        this.getGasPrices = (_, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._integrationService.getGasPrices();
            if (!response.data)
                return sendResponse(401, { error: [{ message: response.errors }], status: false });
            sendResponse(200, { data: response, status: true });
        });
        this.getCoinByContractAddress = ({ params }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._integrationService.getCoinByContractAddress({ contract_address: params.token });
            if (!response)
                return sendResponse(401, { error: response, status: false });
            if (!response.response) {
                return sendResponse(401, { status: false, error: [{ message: 'unable to get token' }] });
            }
            if (!response.response.success) {
                return sendResponse(401, { status: false, data: [{ message: response.response.message }] });
            }
            sendResponse(200, { data: response.response.contract, status: true });
        });
        this.getListOfTokensInWallet = ({ params }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            const { token } = params;
            const response = yield this._integrationService.getListOfTokensInWallet({ token });
            if (!response.data)
                return sendResponse(401, { error: response.errors, status: false });
            sendResponse(200, { data: response.data, status: true });
        });
        this.buyCoin = ({ body }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this._integrationService.buyCoin(body);
            if (response.errors)
                return sendResponse(401, { error: response.errors, status: false });
            if (!response.response.status) {
                return sendResponse(401, {
                    error: [{ message: (_a = response.response.message) !== null && _a !== void 0 ? _a : 'unable to make transaction' }],
                    status: false
                });
            }
            sendResponse(200, {
                data: { message: response.response.message },
                status: true
            });
        });
        this.sellCoin = ({ body }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c, _d;
            const response = yield this._integrationService.sellCoin(body);
            if (!response.response)
                return sendResponse(401, { error: response.errors, status: false });
            if (!((_b = response === null || response === void 0 ? void 0 : response.response) === null || _b === void 0 ? void 0 : _b.status)) {
                return sendResponse(401, {
                    error: [{ message: (_d = (_c = response === null || response === void 0 ? void 0 : response.response) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : 'unable to make transaction' }],
                    status: false
                });
            }
            sendResponse(200, { data: response, status: true });
        });
        this.limitBuyCoin = ({ body }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._integrationService.limitBuy(body);
            if (!response)
                return sendResponse(401, { error: [{ message: response }], status: false });
            sendResponse(200, { data: response, status: true });
        });
        this.limitSellCoin = ({ body }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._integrationService.limitSell(body);
            if (!response)
                return sendResponse(401, { error: [{ message: response }], status: false });
            sendResponse(200, { data: response, status: true });
        });
        this.importWallet = ({ body }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._integrationService.importWallet(body);
            if (!response.data)
                return sendResponse(401, { error: response.errors, status: false });
            sendResponse(200, { data: response, status: true });
        });
        this.transferEth = ({ body }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            console.log('body', body);
            const response = yield this._integrationService.transferEth(body);
            if (!response.data)
                return sendResponse(401, { error: response.errors, status: false });
            sendResponse(200, { data: response, status: true });
        });
        this.transferToken = ({ body }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            console.log(body);
            const response = yield this._integrationService.transferToken(body);
            if (!response.data)
                return sendResponse(401, { error: response.errors, status: false });
            sendResponse(200, { data: response, status: true });
        });
        this.getBalance = ({ params }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._integrationService.getBalance(params.token);
            if (!response.data)
                return sendResponse(401, { error: response.errors, status: false });
            sendResponse(200, { data: response.data, status: true });
        });
        this._integrationService = integrationService;
    }
}
exports.default = IntegrationController;
// how to validate email?
