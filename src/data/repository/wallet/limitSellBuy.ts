import { Telegraf } from "telegraf";
import { MessageTemplete } from "../../handler/template/message";
import { LimitMarketModel } from "../database/models/limit";
import { UserModel } from "../database/models/user";
import TradeRepository from './trade';

export const LimitBuySell = async ({ tradeRepository, telegrambot } : { tradeRepository: TradeRepository, telegrambot: Telegraf}) => {
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

            console.log(1)

            const currentToken = await tradeRepository.getCoinByContractAddress({ contract_address: limitbuySell.tokenInfo.contractAddress });
            console.log('current price', currentToken.contract?.constant_price)

            if (!currentToken.contract?.constant_price) {
                console.log("Unable to use token");
                continue;
            }

            console.log(2)

            if (parseFloat(currentToken.contract.constant_price) > limitbuySell.price) {
                continue;
            }

            console.log(3)
            const response = await tradeRepository.swapEthToToken({
                wallet,
                amount: limitbuySell.amount,
                slippage: limitbuySell.slippage,
                tokenInfo: limitbuySell.tokenInfo,
                gas_fee: 1000000
            }, (data) => {
                telegrambot.telegram.sendMessage(user.telegram_id, MessageTemplete.buyNotificationMessage(user, data));
              });

            console.log(4)

            console.log('response', response)
            if (response.status) {
                await LimitMarketModel.findByIdAndRemove(limitbuySell._id);
            }

            console.log(5)
        }

        if (limitbuySell.marketType == 'sell') {
           console.log(1)
            const currentToken = await tradeRepository.getCoinByContractAddress({ contract_address: limitbuySell.tokenInfo.contractAddress });

            console.log(2)
            if (!currentToken.contract?.constant_price) {
                console.log("Unable to use token");
                continue;
            }

            console.log(3)

            if (parseFloat(currentToken.contract.constant_price) < limitbuySell.price) {
                continue;
            }

            console.log(4)
            const response = await tradeRepository.swapTokenToEth({
                wallet,
                amount: limitbuySell.amount,
                slippage: limitbuySell.slippage,
                tokenInfo: limitbuySell.tokenInfo,
                gas_fee: 1000000
            }, (data) => {
                telegrambot.telegram.sendMessage(user.telegram_id, MessageTemplete.buyNotificationMessage(user, data));
              })
            console.log(5)
            if (response.status) {
                await LimitMarketModel.findByIdAndRemove(limitbuySell._id);
            }

            console.log(6)
        }
    }

}

export const continueMarketCheck = async () => {
    try {
        const YOUR_BOT_TOKEN = process.env.YOUR_BOT_TOKEN!;

        const tradeRepository = new TradeRepository();
        const telegrambot = new Telegraf(YOUR_BOT_TOKEN);

        setTimeout(() => {
            LimitBuySell({ tradeRepository, telegrambot })
        }, 1000 * 2);
    } catch (err) {
        console.log(err);
    }
}