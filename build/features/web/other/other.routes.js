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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../../data/repository/database/models/user");
const encryption_1 = __importDefault(require("../../../data/repository/encryption"));
const trade_1 = __importDefault(require("../../../data/repository/wallet/trade"));
const wallet_1 = __importDefault(require("../../../data/repository/wallet/wallet"));
const limit_1 = require("../../../data/repository/database/models/limit");
const other_controller_1 = __importDefault(require("./other.controller"));
const other_service_1 = __importDefault(require("./other.service"));
const otherUserRoutes = ({ router }) => __awaiter(void 0, void 0, void 0, function* () {
    const tradeRepository = new trade_1.default();
    const walletRepository = new wallet_1.default();
    const encryptionRepository = new encryption_1.default();
    const otherService = new other_service_1.default({ userModel: user_1.UserModel, tradeRepository, encryptionRepository, walletRepository, limitMarketModel: limit_1.LimitMarketModel });
    const otherController = new other_controller_1.default({ otherService });
    router.postWithBody('/referral_code', otherController.addReferralCode);
});
exports.default = otherUserRoutes;
