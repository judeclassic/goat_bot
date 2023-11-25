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
class OtherController {
    constructor({ otherService }) {
        this.addReferralCode = ({ body }, sendResponse) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._otherService.addReferralCode(body);
            if (!response.userResponse)
                return sendResponse(401, { error: response.errors, status: false });
            if (!(response === null || response === void 0 ? void 0 : response.userResponse)) {
                return sendResponse(401, {
                    error: [{ message: 'unable to make transaction' }],
                    status: false
                });
            }
            sendResponse(200, { data: response, status: true });
        });
        this._otherService = otherService;
    }
}
exports.default = OtherController;
