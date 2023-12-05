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
const integration_controller_1 = __importDefault(require("./integration.controller"));
const integration_service_1 = __importDefault(require("./integration.service"));
const limit_1 = require("../../../data/repository/database/models/limit");
const telegraf_1 = require("telegraf");
const integrationUserRoutes = ({ router }) => __awaiter(void 0, void 0, void 0, function* () {
    const YOUR_BOT_TOKEN = process.env.YOUR_BOT_TOKEN;
    const tradeRepository = new trade_1.default();
    const walletRepository = new wallet_1.default();
    const encryptionRepository = new encryption_1.default();
    const bot = new telegraf_1.Telegraf(YOUR_BOT_TOKEN);
    const integrationService = new integration_service_1.default({ bot, userModel: user_1.UserModel, tradeRepository, encryptionRepository, walletRepository, limitMarketModel: limit_1.LimitMarketModel });
    const integrationController = new integration_controller_1.default({ integrationService });
    router.get('/getgasprices', integrationController.getGasPrices);
    router.get('/getlistoftoken/:token', integrationController.getListOfTokensInWallet);
    router.get('/get-token-by-contract/:token', integrationController.getCoinByContractAddress);
    router.postWithBody('/marketbuy', integrationController.buyCoin);
    router.postWithBody('/marketsell', integrationController.sellCoin);
    router.postWithBody('/limitbuy', integrationController.limitBuyCoin);
    router.postWithBody('/limitsell', integrationController.limitSellCoin);
    router.postWithBody('/import_wallet', integrationController.importWallet);
    router.get('/get_balance/:token', integrationController.getBalance);
    router.postWithBody('/send_tokens', integrationController.transferToken);
    router.postWithBody('/send_eth', integrationController.transferEth);
    router.postWithBody('/market_swap', integrationController.marketSwapCoin);
});
exports.default = integrationUserRoutes;
