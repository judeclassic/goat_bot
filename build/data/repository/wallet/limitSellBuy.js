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
exports.continueMarketCheck = exports.LimitBuySell = void 0;
const smart_order_router_1 = require("@uniswap/smart-order-router");
const jsbi_1 = __importDefault(require("jsbi"));
const ethers_1 = require("ethers");
const sdk_core_1 = require("@uniswap/sdk-core");
const erc20_aba_1 = require("./erc20_aba");
const limit_1 = require("../database/models/limit");
const user_1 = require("../database/models/user");
const LimitBuySell = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log('meee');
    const V3_SWAP_CONTRACT_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
    const INFURA_URL = process.env.INFURA;
    const web3Provider = new ethers_1.ethers.providers.JsonRpcProvider(INFURA_URL);
    const ChainId = 1;
    const router = new smart_order_router_1.AlphaRouter({ chainId: ChainId, provider: web3Provider });
    const limitbuySells = yield limit_1.LimitMarketModel.find();
    for (let i = 0; i < limitbuySells.length; i++) {
        const limitbuySell = limitbuySells[i];
        const user = yield user_1.UserModel.findOne({ telegram_id: limitbuySell.userId });
        if (!user) {
            continue;
        }
        const wallet = user.wallets.find((wallet) => wallet.address === limitbuySell.walletAddress);
        if (!wallet) {
            continue;
        }
        const private_key = wallet.private_key;
        const highAmoumt = ((limitbuySell.slippage / 100) * limitbuySell.amount) + limitbuySell.amount;
        const lowerAmoumt = limitbuySell.amount + ((limitbuySell.slippage / 100) * limitbuySell.amount);
        if (limitbuySell.marketType == 'buy') {
            const name0 = 'Wrapped Ether';
            const symbol0 = 'WETH';
            const decimal0 = 18;
            const address0 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
            const decimal1 = 18;
            const address1 = limitbuySell.contractAddress;
            const WETH = new sdk_core_1.Token(ChainId, address0, decimal0, symbol0, name0);
            const ERC20 = new sdk_core_1.Token(ChainId, address1, decimal1);
            const wei = ethers_1.ethers.utils.parseUnits(limitbuySell.amount.toString(), 18);
            const inputAmount = sdk_core_1.CurrencyAmount.fromRawAmount(WETH, jsbi_1.default.BigInt(wei));
            const options = {
                recipient: limitbuySell.walletAddress,
                slippageTolerance: new sdk_core_1.Percent(limitbuySell.slippage, 100),
                deadline: Math.floor(Date.now() / 1000 + 1800),
                type: smart_order_router_1.SwapType.SWAP_ROUTER_02,
            };
            const route = yield router.route(inputAmount, ERC20, sdk_core_1.TradeType.EXACT_INPUT, options);
            //console.log(`qoute is ${route?.quote.toFixed(10)}`)
            let equivalentAmount = route === null || route === void 0 ? void 0 : route.quote.toFixed(10);
            // get ether balance in wei
            const balanceWei = yield web3Provider.getBalance(limitbuySell.walletAddress);
            // Convert Wei to Ether
            const balanceEther = ethers_1.ethers.utils.formatEther(balanceWei);
            if (parseInt(balanceEther) < limitbuySell.amount) {
                continue;
            }
            if (equivalentAmount < lowerAmoumt || equivalentAmount > highAmoumt) {
                continue;
            }
            console.log("pass");
            const transaction = {
                data: (_a = route === null || route === void 0 ? void 0 : route.methodParameters) === null || _a === void 0 ? void 0 : _a.calldata,
                to: V3_SWAP_CONTRACT_ADDRESS,
                value: ethers_1.BigNumber.from((_b = route === null || route === void 0 ? void 0 : route.methodParameters) === null || _b === void 0 ? void 0 : _b.value),
                from: limitbuySell.walletAddress,
                gasPrice: ethers_1.BigNumber.from(route === null || route === void 0 ? void 0 : route.gasPriceWei),
                gasLimit: ethers_1.ethers.utils.hexlify(1000000),
            };
            const wallets = new ethers_1.ethers.Wallet(private_key);
            const connectedWallet = wallets.connect(web3Provider);
            const approveAmout = ethers_1.ethers.utils.parseUnits('1', 18).toString();
            const contract0 = new ethers_1.ethers.Contract(address0, erc20_aba_1.ERC20ABI, web3Provider);
            // approve v3 swap contract
            const approveV3Contract = yield contract0.connect(connectedWallet).approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout);
            //console.log(`approve v3 contract ${approveV3Contract}`)
            const tradeTransaction = yield connectedWallet.sendTransaction(transaction);
        }
        if (limitbuySell.marketType == 'sell') {
            console.log("sell");
            const decimal0 = 18;
            const address0 = limitbuySell.contractAddress;
            const name1 = 'Wrapped Ether';
            const symbol1 = 'WETH';
            const decimal1 = 18;
            const address1 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
            const WETH = new sdk_core_1.Token(ChainId, address1, decimal1, symbol1, name1);
            const erc20Token = new sdk_core_1.Token(ChainId, address0, decimal0);
            const wei = ethers_1.ethers.utils.parseUnits(limitbuySell.amount.toString(), 18);
            const inputAmount = sdk_core_1.CurrencyAmount.fromRawAmount(erc20Token, jsbi_1.default.BigInt(wei));
            const options = {
                //recipient: wallet.address,
                recipient: wallet.address,
                slippageTolerance: new sdk_core_1.Percent(limitbuySell.slippage, 100),
                deadline: Math.floor(Date.now() / 1000 + 1800),
                type: smart_order_router_1.SwapType.SWAP_ROUTER_02,
            };
            const route = yield router.route(inputAmount, WETH, sdk_core_1.TradeType.EXACT_INPUT, options);
            let equivalentAmount = route === null || route === void 0 ? void 0 : route.quote.toFixed(10);
            console.log(`qoute is ${route === null || route === void 0 ? void 0 : route.quote.toFixed(10)}`);
            if (equivalentAmount < lowerAmoumt || equivalentAmount > highAmoumt) {
                continue;
            }
            const transaction = {
                data: (_c = route === null || route === void 0 ? void 0 : route.methodParameters) === null || _c === void 0 ? void 0 : _c.calldata,
                to: V3_SWAP_CONTRACT_ADDRESS,
                value: ethers_1.BigNumber.from((_d = route === null || route === void 0 ? void 0 : route.methodParameters) === null || _d === void 0 ? void 0 : _d.value),
                from: limitbuySell.walletAddress,
                gasPrice: ethers_1.BigNumber.from(route === null || route === void 0 ? void 0 : route.gasPriceWei),
                gasLimit: ethers_1.ethers.utils.hexlify(1000000),
            };
            const wallets = new ethers_1.ethers.Wallet(private_key);
            const connectedWallet = wallets.connect(web3Provider);
            const approveAmout = ethers_1.ethers.utils.parseUnits('3', 18).toString();
            const contract0 = new ethers_1.ethers.Contract(address0, erc20_aba_1.ERC20ABI, web3Provider);
            const transferEvents = yield contract0.queryFilter(contract0.filters.Transfer(null, limitbuySell.walletAddress, null));
            //cheeck if wallet contain the token before
            if (transferEvents.length < 1) {
                continue;
            }
            const balance = yield contract0.balanceOf(limitbuySell.walletAddress);
            const balanceEther = ethers_1.ethers.utils.formatEther(balance);
            //check if you have enough erc20 in your wallet
            if (parseInt(balanceEther) < limitbuySell.amount) {
                continue;
            }
            // approve v3 swap contract
            const approveV3Contract = yield contract0.connect(connectedWallet).approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout);
            //console.log(`approve v3 contract ${approveV3Contract}`)
            const tradeTransaction = yield connectedWallet.sendTransaction(transaction);
        }
    }
});
exports.LimitBuySell = LimitBuySell;
const continueMarketCheck = () => __awaiter(void 0, void 0, void 0, function* () {
    setInterval(exports.LimitBuySell, 1000 * 60 * 2);
});
exports.continueMarketCheck = continueMarketCheck;
