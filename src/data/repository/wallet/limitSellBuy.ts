import { LimitMarketModel } from "../database/models/limit";
import { UserModel } from "../database/models/user";
import TradeRepository from './trade';

export const LimitBuySell = async ({ tradeRepository } : { tradeRepository: TradeRepository}) => {
    const limitbuySells = await LimitMarketModel.find();

    // const currentToken = await tradeRepository.getCoinByContractAddress({ contract_address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" });

    // console.log('token price', currentToken.contract?.constant_price)

    for (const element of limitbuySells) {
        const limitbuySell = element;

        console.log(limitbuySell);
        
        const user = await UserModel.findOne({telegram_id: limitbuySell.userId});
        if (!user) continue;

        const wallet = user.wallets.find((wallet) => wallet.address === limitbuySell.walletAddress);
        if (!wallet) continue;

        if (limitbuySell.marketType == 'buy') {

            const etherToken = await tradeRepository.getCoinByContractAddress({ contract_address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" });

            if (!etherToken.contract?.constant_price) {
                continue;
            }

            const currentToken = await tradeRepository.getCoinByContractAddress({ contract_address: limitbuySell.tokenInfo.contractAddress });

            if (!currentToken.contract?.constant_price) {
                console.log("Unable to use token");
                continue;
            }

            const tokenInEth = (parseFloat(currentToken.contract.constant_price) / parseFloat(etherToken.contract?.constant_price)).toFixed(18)

            if (parseFloat(tokenInEth) > limitbuySell.price) {
                continue;
            }
            const response = await tradeRepository.swapEthToToken({
                wallet,
                amount: limitbuySell.amount,
                slippage: limitbuySell.slippage,
                tokenInfo: limitbuySell.tokenInfo,
                gas_fee: 1000000
            });
            if (!response.status) {
                LimitMarketModel.findByIdAndRemove(user._id);
            }
        }

        if (limitbuySell.marketType == 'sell') {
            const etherToken = await tradeRepository.getCoinByContractAddress({ contract_address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" });

            if (!etherToken.contract?.constant_price) {
                continue;
            }

            const currentToken = await tradeRepository.getCoinByContractAddress({ contract_address: limitbuySell.tokenInfo.contractAddress });

            if (!currentToken.contract?.constant_price) {
                console.log("Unable to use token");
                continue;
            }

            const tokenInEth = (parseFloat(currentToken.contract.constant_price) / parseFloat(etherToken.contract?.constant_price)).toFixed(18)

            if (parseFloat(tokenInEth) < limitbuySell.price) {
                continue;
            }
            const response = await tradeRepository.swapTokenToEth({
                wallet,
                amount: limitbuySell.amount,
                slippage: limitbuySell.slippage,
                tokenInfo: limitbuySell.tokenInfo,
                gas_fee: 1000000
            })
            if (!response.status) {
                LimitMarketModel.findByIdAndRemove(user._id);
            }
        }
    }

}

export const continueMarketCheck = async () => {
    try {
    
        setInterval(() => {
            const tradeRepository = new TradeRepository()
            LimitBuySell({ tradeRepository })
        }, 1000 * 2);
    } catch (err) {
        console.log(err);
    }
}