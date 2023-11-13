"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentConfig = exports.Environment = void 0;
const v3_sdk_1 = require("@uniswap/v3-sdk");
const constants_1 = require("./constants");
// Sets if the example should run locally or on chain
var Environment;
(function (Environment) {
    Environment[Environment["LOCAL"] = 0] = "LOCAL";
    Environment[Environment["MAINNET"] = 1] = "MAINNET";
    Environment[Environment["WALLET_EXTENSION"] = 2] = "WALLET_EXTENSION";
})(Environment = exports.Environment || (exports.Environment = {}));
// Example Configuration
exports.CurrentConfig = {
    env: Environment.LOCAL,
    rpc: {
        local: 'http://localhost:8545',
        mainnet: '',
    },
    wallet: {
        address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    },
    tokens: {
        in: constants_1.WETH_TOKEN,
        amountIn: 1,
        out: constants_1.USDC_TOKEN,
        poolFee: v3_sdk_1.FeeAmount.MEDIUM,
    },
};
