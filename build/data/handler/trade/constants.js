"use strict";
// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = exports.MAX_PRIORITY_FEE_PER_GAS = exports.MAX_FEE_PER_GAS = exports.WETH_ABI = exports.ERC20_ABI = exports.USDC_TOKEN = exports.WETH_TOKEN = exports.WETH_CONTRACT_ADDRESS = exports.SWAP_ROUTER_ADDRESS = exports.QUOTER_CONTRACT_ADDRESS = exports.POOL_FACTORY_CONTRACT_ADDRESS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
// Addresses
exports.POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
exports.QUOTER_CONTRACT_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';
exports.SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
exports.WETH_CONTRACT_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
// Currencies and Tokens
exports.WETH_TOKEN = new sdk_core_1.Token(sdk_core_1.SUPPORTED_CHAINS[0], '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether');
exports.USDC_TOKEN = new sdk_core_1.Token(sdk_core_1.SUPPORTED_CHAINS[0], '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC', 'USD//C');
// ABI's
exports.ERC20_ABI = [
    // Read-Only Functions
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    // Authenticated Functions
    'function transfer(address to, uint amount) returns (bool)',
    'function approve(address _spender, uint256 _value) returns (bool)',
    // Events
    'event Transfer(address indexed from, address indexed to, uint amount)',
];
exports.WETH_ABI = [
    // Wrap ETH
    'function deposit() payable',
    // Unwrap ETH
    'function withdraw(uint wad) public',
];
// Transactions
exports.MAX_FEE_PER_GAS = 100000000000;
exports.MAX_PRIORITY_FEE_PER_GAS = 100000000000;
exports.TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000000000000000000;
