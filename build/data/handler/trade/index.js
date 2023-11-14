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
const IUniswapV3Pool_json_1 = __importDefault(require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"));
const v3_sdk_1 = require("@uniswap/v3-sdk");
const ethers_1 = require("ethers");
const config_1 = require("./config");
const constants_1 = require("./constants");
const testing = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new ethers_1.ethers.providers.EtherscanProvider();
    const currentPoolAddress = (0, v3_sdk_1.computePoolAddress)({
        factoryAddress: constants_1.POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: config_1.CurrentConfig.tokens.in,
        tokenB: config_1.CurrentConfig.tokens.out,
        fee: config_1.CurrentConfig.tokens.poolFee,
    });
    const poolContract = new ethers_1.ethers.Contract(currentPoolAddress, IUniswapV3Pool_json_1.default.abi, provider);
    const [token0, token1, fee, tickSpacing, liquidity, slot0] = yield Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);
    // return {
    //     token0,
    //     token1,
    //     fee,
    //     tickSpacing,
    //     liquidity,
    //     sqrtPriceX96: slot0[0],
    //     tick: slot0[1],
    // }
});
// testing()
