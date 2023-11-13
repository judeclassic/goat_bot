"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = exports.TransactionState = void 0;
const ethers_1 = require("ethers");
const config_1 = require("./config");
// Single copies of provider and wallet
const mainnetProvider = new ethers_1.ethers.providers.JsonRpcProvider(config_1.CurrentConfig.rpc.mainnet);
const wallet = createWallet();
// Interfaces
var TransactionState;
(function (TransactionState) {
    TransactionState["Failed"] = "Failed";
    TransactionState["New"] = "New";
    TransactionState["Rejected"] = "Rejected";
    TransactionState["Sending"] = "Sending";
    TransactionState["Sent"] = "Sent";
})(TransactionState = exports.TransactionState || (exports.TransactionState = {}));
// Provider and Wallet Functions
function getProvider() {
    return wallet.provider;
}
exports.getProvider = getProvider;
function createWallet() {
    let provider = mainnetProvider;
    if (config_1.CurrentConfig.env == config_1.Environment.LOCAL) {
        provider = new ethers_1.ethers.providers.JsonRpcProvider(config_1.CurrentConfig.rpc.local);
    }
    return new ethers_1.ethers.Wallet(config_1.CurrentConfig.wallet.privateKey, provider);
}
