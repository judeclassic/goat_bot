"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("../../../data/repository/validator/validator"));
class IntegrationValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.validateLimitOption = (option) => {
            const errors = [];
            const validateLimit = this._validateNumber(option.limit);
            if (validateLimit.message) {
                errors.push({ field: 'limit', message: validateLimit.message });
            }
            const validatePage = this._validateNumber(option.page);
            if (validatePage.message) {
                errors.push({ field: 'limit', message: validatePage.message });
            }
            return errors;
        };
        this.validateInfo = ({ user_id, wallet_address }) => {
            const errors = [];
            const validateID = this._validateID(user_id);
            if (validateID.message) {
                errors.push({ field: 'user_id', message: validateID.message });
            }
            const validateWallet = this._validateID(wallet_address);
            if (validateWallet.message) {
                errors.push({ field: 'wallet_address', message: validateWallet.message });
            }
            return errors;
        };
    }
}
;
exports.default = IntegrationValidator;
