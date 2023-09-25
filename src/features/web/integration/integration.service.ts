import { IOtherWallet, UserModel } from "../../../data/repository/database/models/user";
import TradeRepository from "../../../data/repository/wallet/trade";
import IError from "../../../data/types/error/error";

class IntegrationService {
  private _userModel: typeof UserModel;
  private _tradeRepository: TradeRepository;

  constructor ({ userModel, tradeRepository} : { userModel: typeof UserModel; tradeRepository: TradeRepository; }){
    this._userModel = userModel;
    this._tradeRepository = tradeRepository;
  }

  public getGasPrices = async () => {
    const gasPricesResponse = await this._tradeRepository.getGasPrices();
    if ( !gasPricesResponse.success || !gasPricesResponse.gasPrices ) {
      return { error: 'unable to get gas prices' };
    } 
    return { data: gasPricesResponse.gasPrices };
  };

  public getListOfTokensInWallet = async ({ user_id, wallet_address } : {
    user_id: string, wallet_address: string
  }): Promise<{ error?: IError[], data?: any[] }> => {
    const user = await this._userModel.findOne({ telegram_id: user_id });
    if (!user) return { error: [{ message: 'unable to get user information' }]};

    const wallet = user.wallets.find((wallet) => wallet.address === wallet_address);
    if (!wallet) return { error: [{ message: 'unable to get wallet information' }]};

    const tokensResponse = await this._tradeRepository.getListOfTokensInWallet({ wallet });
    if ( !tokensResponse ) {
      return { error: [{ message: 'unable to get list of token' }]};
    } 
    return { data: tokensResponse };
  };

  public buyCoin = async ({ user_id, wallet_address, contract_address, amount, slippage, gas_fee }:{
    user_id: string,
    wallet_address: string,
    slippage: number;
    contract_address: string,
    amount: number
    gas_fee: number
  }) => {
    const user = await this._userModel.findOne({ telegram_id: user_id });
    if (!user) return { errors: [{ message: 'user not found'}] };

    const wallet = user.wallets.find((wallet) => wallet.address === wallet_address);
    if (!wallet) return { error: [{ message: 'unable to get wallet information' }]};

    const response = await this._tradeRepository.swapEthToToken({ contract_address, amount, slippage, wallet, gas_fee });
    if ( !response ) {
      return { error: [{ message: 'unable to place trade' }]};
    }

    return { response };
  };

  public sellCoin = async ({ user_id, wallet_address, contract_address, amount, slippage, gas_fee }:{
    user_id: string,
    wallet_address: string,
    slippage: number;
    contract_address: string,
    amount: number
    gas_fee: number
  }) => {
      const user = await this._userModel.findOne({ telegram_id: user_id });
      if (!user) return { errors: [{ message: 'user not found'}] };

      const wallet = user.wallets.find((wallet) => wallet.address === wallet_address);
      if (!wallet) return { error: [{ message: 'unable to get wallet information' }]};

      const response = await this._tradeRepository.swapTokenToEth({ contract_address, amount, slippage, wallet, gas_fee });
      if ( !response ) {
        return { error: [{ message: 'unable to place trade' }]};
      }

      return { response };
  };

}

export default IntegrationService;
