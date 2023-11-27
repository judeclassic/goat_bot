"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const server_1 = __importDefault(require("./data/repository/server"));
const connect_1 = __importDefault(require("./data/repository/database/connect"));
const telegram_routes_1 = require("./features/telegram/telegram.routes");
const encryption_1 = __importDefault(require("./data/repository/encryption"));
const router_1 = __importDefault(require("./data/repository/server/router"));
const integration_routes_1 = __importDefault(require("./features/web/integration/integration.routes"));
const logger_ts_1 = require("./data/repository/logger.ts");
const other_routes_1 = __importDefault(require("./features/web/other/other.routes"));
dotenv_1.default.config();
const dBConnection = new connect_1.default();
dBConnection.connect();
exports.default = (0, server_1.default)((app, _server) => {
    (0, cors_1.default)();
    (0, telegram_routes_1.useTelegramBot)();
    // continueMarketCheck();
    const authenticationRepo = new encryption_1.default();
    const router = new router_1.default({ router: app, authenticationRepo, host: '/api' });
    router.extend('/integrations', integration_routes_1.default);
    router.extend('/other', other_routes_1.default);
    // if (process.env.NODE_ENV === 'development') 
    logger_ts_1.initLogger.useExpressMonganMiddleWare(app);
    // if (process.env.NODE_ENV === 'development')
    logger_ts_1.initLogger.checkRoutes(router);
});
