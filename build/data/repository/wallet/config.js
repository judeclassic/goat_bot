"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentConfig = exports.Environment = exports.USDC_TOKEN = exports.WETH_TOKEN = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const v3_sdk_1 = require("@uniswap/v3-sdk");
exports.WETH_TOKEN = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether');
exports.USDC_TOKEN = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC', 'USD//C');
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
        in: exports.WETH_TOKEN,
        amountIn: 1,
        out: exports.USDC_TOKEN,
        poolFee: v3_sdk_1.FeeAmount.MEDIUM,
    },
};
