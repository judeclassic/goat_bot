"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogger = exports.defaultLogger = void 0;
const winston_1 = __importStar(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN;
const DATADOG_APPLICATION_NAME = process.env.DATADOG_APPLICATION_NAME;
const DATADOG_SITE = process.env.DATADOG_SITE;
const SENTRY_DSN = process.env.SENTRY_DSN;
const { combine, timestamp, json, colorize } = winston_1.format;
const customColors = {
    emerg: "red",
    alert: "red",
    crit: "red",
    error: "red",
    warning: "yellow",
    notice: "blue",
    info: "green",
    debug: "gray",
};
const useFormat = combine(timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
}), json(), colorize({ colors: customColors }));
const httpTransportOptions = {
    host: DATADOG_SITE,
    path: `/api/v2/logs?dd-api-key=${DATADOG_CLIENT_TOKEN}&ddsource=nodejs&service=${DATADOG_APPLICATION_NAME}`,
    ssl: true
};
exports.defaultLogger = console;
class LoggerImplementation {
    constructor() {
        this.useExpressMonganMiddleWare = (route) => {
            let toggleColor = (message) => {
                if (message.search(' 200') > 0) {
                    return '✅';
                }
                if (message.search(' 500') > 0) {
                    return '❗';
                }
                if (message.search(' 201') > 0) {
                    return '✅';
                }
                return '🔔';
            };
            let middleWare = (0, morgan_1.default)('tiny', {
                stream: {
                    write: (message) => this.winston.createLogger({
                        format: this.winston.format.combine(this.winston.format.colorize(), this.winston.format.label({ label: `${toggleColor(message.trim())}`, message: true }), this.winston.format.timestamp(), this.winston.format.printf((info) => {
                            return `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.message}`;
                        })),
                        transports: [new this.winston.transports.Console({ level: 'http' })],
                    }).http(message.trim()),
                },
            });
            route.use(middleWare);
        };
        this.checkRoutes = (router, errorOnMultiple = true) => {
            const colors = require("colors/safe");
            setTimeout(() => {
                console.log(colors.bgBrightRed('listing end points'));
                router.listEndPoint.forEach((endPoint, index) => {
                    if (errorOnMultiple) {
                        const data = router.listEndPoint.filter((d) => d.endpoint === endPoint.endpoint && d.method === endPoint.method);
                        if (data.length > 1) {
                            throw Error(colors.brightMagenta.bgRed(`Multiple Endpoint ${data.length} ${endPoint.method} ${endPoint.endpoint}`));
                        }
                    }
                    if (endPoint.method === 'POST') {
                        console.log(colors.blue(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares} `));
                        return;
                    }
                    if (endPoint.method === 'GET') {
                        console.log(colors.green(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                        return;
                    }
                    if (endPoint.method === 'PUT') {
                        console.log(colors.magenta(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                        return;
                    }
                    if (endPoint.method === 'DELETE') {
                        console.log(colors.red(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                        return;
                    }
                });
                console.log(colors.brightMagenta.bgCyan(`you have ${colors.bold(router.listEndPoint.length)} end points`));
            }, 2000);
        };
        this.winston = winston_1.default;
    }
}
exports.initLogger = new LoggerImplementation();
