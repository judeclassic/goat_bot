import { IOtherWallet, UserModel } from "../../../data/repository/database/models/user";
import EncryptionRepository, { TokenType } from "../../../data/repository/encryption";
import TradeRepository from "../../../data/repository/wallet/trade";
import WalletRepository from "../../../data/repository/wallet/wallet";
import IError from "../../../data/types/error/error";

class IntegrationService {
  private _userModel: typeof UserModel;
  private _tradeRepository: TradeRepository;
  private _walletRepository: WalletRepository;
  private _encryptionRepository: EncryptionRepository;

  constructor ({ userModel, tradeRepository, encryptionRepository, walletRepository} : {
    userModel: typeof UserModel;
    tradeRepository: TradeRepository;
    encryptionRepository: EncryptionRepository;
    walletRepository: WalletRepository;
  }){
    this._userModel = userModel;
    this._tradeRepository = tradeRepository;
    this._encryptionRepository = encryptionRepository;
    this._walletRepository = walletRepository;

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

  public importWallet = async ({ token, private_key }:{
    token: string,
    private_key: string,
  }) => {
      const decoded: any = this._encryptionRepository.decryptToken(token, TokenType.accessToken);
      if (!decoded?.telegram_id) return { errors: [{ message: 'Invalid request'}] };

      const user = await this._userModel.findOne({ telegram_id: decoded.telegram_id });
      if (!user) return { errors: [{ message: 'user not found'}] };

      if (user.wallets.find((wallet) => wallet?.private_key === private_key)) {
        return { errors: [{ message: 'This wallet is already imported'}] };
      }

      if (user.wallets.length > 2) {
        return { errors: [{ message: 'Remove one wallet to add this wallet'}] };
      }

      const wallet = await this._walletRepository.importWallet(private_key);
      if (!wallet) return { errors: [{ message: 'invalid private key' }]};
      user.wallets.push(wallet)
      await user.save();

      return { data: "Successfully updated" }
  };

}

export default IntegrationService;
