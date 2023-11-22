import { LimitMarketModel } from "../database/models/limit";
import { UserModel } from "../database/models/user";
import TradeRepository from './trade';

export const LimitBuySell = async ({ tradeRepository } : { tradeRepository: TradeRepository}) => {
    const limitbuySells = await LimitMarketModel.find();

    for (let i = 0; i < limitbuySells.length; i++) {
        const limitbuySell = limitbuySells[i];

        console.log(limitbuySell);

        const currentToken = await tradeRepository.getCoinByContractAddress({ contract_address: limitbuySell.tokenInfo.contractAddress });
        if (!currentToken.contract?.constant_price) {
            console.log("Unable to use token");
            continue;
        }

        if (parseFloat(currentToken.contract.constant_price) === limitbuySell.price) {
            continue;
        }
        
        const user = await UserModel.findOne({telegram_id: limitbuySell.userId});
        if (!user) continue;

        const wallet = user.wallets.find((wallet) => wallet.address === limitbuySell.walletAddress);
        if (!wallet) continue;

        if (limitbuySell.marketType == 'buy') {
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
    const tradeRepository = new TradeRepository()
        setInterval(() => {
            LimitBuySell({ tradeRepository })
        }, 1000 * 5);
    } catch (err) {
        console.log(err);
    }
}