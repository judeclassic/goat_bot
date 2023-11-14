import {
    AlphaRouter,
    // ChainId,
     SwapOptionsSwapRouter02,
    // SwapRoute,
     SwapType,
  } from '@uniswap/smart-order-router'
  import JSBI from "jsbi";
  import { ethers, BigNumber } from 'ethers'
  import { Token, TradeType, CurrencyAmount, Percent, } from '@uniswap/sdk-core'
  import { ERC20ABI } from "./erc20_aba";

  import { LimitMarketModel } from "../database/models/limit";
  import { UserModel } from "../database/models/user";

export const LimitBuySell = async () => {
    
    const V3_SWAP_CONTRACT_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
    const INFURA_URL = process.env.INFURA;

    const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

    const ChainId = 1;
    const router = new AlphaRouter({chainId: ChainId, provider: web3Provider});

    const limitbuySells = await LimitMarketModel.find();

    for (let i = 0; i < limitbuySells.length; i++) {
        const limitbuySell = limitbuySells[i];
        
        const user = await UserModel.findOne({telegram_id: limitbuySell.userId});
        if (!user) {
            continue;
        }

        const wallet = user.wallets.find((wallet) => wallet.address === limitbuySell.walletAddress);
        if (!wallet) {
            continue;
        }

        const private_key = wallet.private_key;

        const highAmoumt = ((limitbuySell.slippage / 100) * limitbuySell.amount) + limitbuySell.amount;
        const lowerAmoumt = limitbuySell.amount + ((limitbuySell.slippage / 100) * limitbuySell.amount)

        if (limitbuySell.marketType == 'buy') {
            const name0 = 'Wrapped Ether';
            const symbol0 = 'WETH';
            const decimal0 = 18;
            const address0 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

            const decimal1 = 18;
            const address1 = limitbuySell.contractAddress;

            const WETH = new Token(ChainId, address0, decimal0, symbol0, name0);
            const ERC20 = new Token(ChainId, address1, decimal1);

            const wei = ethers.utils.parseUnits(limitbuySell.amount.toString(), 18);
            const inputAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei));

            const options: SwapOptionsSwapRouter02 = {
                recipient: limitbuySell.walletAddress,
                slippageTolerance: new Percent(limitbuySell.slippage, 100),
                deadline: Math.floor(Date.now()/1000 + 1800),
                type: SwapType.SWAP_ROUTER_02,
            }

            const route = await router.route(
                inputAmount,
                ERC20,
                TradeType.EXACT_INPUT,
                options
            )
            
            let equivalentAmount: any = route?.quote.toFixed(10)

            // get ether balance in wei
            const balanceWei = await web3Provider.getBalance(limitbuySell.walletAddress);

            // Convert Wei to Ether
            const balanceEther = ethers.utils.formatEther(balanceWei);

            if (parseInt(balanceEther) < limitbuySell.amount) {
                continue;
            }

            if (equivalentAmount < lowerAmoumt || equivalentAmount > highAmoumt) {
                continue
            }

            console.log("pass")

            const transaction = {
                data: route?.methodParameters?.calldata,
                to: V3_SWAP_CONTRACT_ADDRESS,
                value: BigNumber.from(route?.methodParameters?.value),
                from: limitbuySell.walletAddress,
                gasPrice: BigNumber.from(route?.gasPriceWei),
                gasLimit: ethers.utils.hexlify(1000000),
            }
        
            const wallets = new ethers.Wallet(private_key);
            const connectedWallet = wallets.connect(web3Provider);
        
            const approveAmout = ethers.utils.parseUnits(limitbuySell.amount.toString(), 18).toString();
        
            const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider);
            
            // Estimate gas limit
            const gasLimit = await contract0.estimateGas.approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout);

            // Build transaction
            const buildApproveTransaction = await contract0.connect(connectedWallet).approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout, {
                gasLimit: gasLimit.mul(2), // You can adjust the gas limit multiplier as needed
                gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Set your preferred gas price
            });

            // Wait for the transaction to be mined
            const approveTransaction = await buildApproveTransaction;
        
            const tradeTransaction = await connectedWallet.sendTransaction(transaction);
        }

        if (limitbuySell.marketType == 'sell') {
            console.log("sell");

            const decimal0 = 18;
            const address0 = limitbuySell.contractAddress
    
            const name1 = 'Wrapped Ether';
            const symbol1 = 'WETH';
            const decimal1 = 18;
            const address1 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    
            const WETH = new Token(ChainId, address1, decimal1, symbol1, name1);
            const erc20Token = new Token(ChainId, address0, decimal0);
    
            const wei = ethers.utils.parseUnits(limitbuySell.amount.toString(), 18);
            const inputAmount = CurrencyAmount.fromRawAmount(erc20Token, JSBI.BigInt(wei));
    
            const options: SwapOptionsSwapRouter02 = {
              //recipient: wallet.address,
              recipient: wallet.address,
              slippageTolerance: new Percent(limitbuySell.slippage, 100),
              deadline: Math.floor(Date.now()/1000 + 1800),
              type: SwapType.SWAP_ROUTER_02,
            }
    
            const route = await router.route(
              inputAmount,
              WETH,
              TradeType.EXACT_INPUT,
              options
            )
    
            let equivalentAmount: any = route?.quote.toFixed(10)
            
            console.log(`qoute is ${route?.quote.toFixed(10)}`)

            if (equivalentAmount < lowerAmoumt || equivalentAmount > highAmoumt) {
                continue
            }

            const transaction = {
                data: route?.methodParameters?.calldata,
                to: V3_SWAP_CONTRACT_ADDRESS,
                value: BigNumber.from(route?.methodParameters?.value),
                from: limitbuySell.walletAddress,
                gasPrice: BigNumber.from(route?.gasPriceWei),
                gasLimit: ethers.utils.hexlify(1000000),
            }
    
            const wallets = new ethers.Wallet(private_key);
            const connectedWallet = wallets.connect(web3Provider);
    
            const approveAmout = ethers.utils.parseUnits(limitbuySell.amount.toString(), 18).toString();
    
            const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider);

            const balance = await contract0.balanceOf(limitbuySell.walletAddress);

            if (!balance) {
            continue
            }
            const balanceEther = ethers.utils.formatEther(balance);

            //check if you have enough erc20 in your wallet
            if (parseInt(balanceEther) < limitbuySell.amount) {
            continue
            }
    
            // Estimate gas limit
            const gasLimit = await contract0.estimateGas.approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout);

            // Build transaction
            const buildApproveTransaction = await contract0.connect(connectedWallet).approve(V3_SWAP_CONTRACT_ADDRESS, approveAmout, {
            gasLimit: gasLimit.mul(2), // You can adjust the gas limit multiplier as needed
            gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Set your preferred gas price
            });

            // Wait for the transaction to be mined
            const approveTransaction = await buildApproveTransaction;

            const tradeTransaction = await connectedWallet.sendTransaction(transaction);
            
        }
        
    }

}

export const continueMarketCheck = async () => {
    try {
        setInterval(LimitBuySell, 1000 * 60 * 2);
    } catch (err) {
        console.log(err);
    }
}