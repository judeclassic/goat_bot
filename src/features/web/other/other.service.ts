import { IOtherWallet, UserModel } from "../../../data/repository/database/models/user";
import EncryptionRepository, { TokenType } from "../../../data/repository/encryption";
import TradeRepository from "../../../data/repository/wallet/trade";
import WalletRepository from "../../../data/repository/wallet/wallet";
import IError from "../../../data/types/error/error";
import { LimitMarketModel } from "../../../data/repository/database/models/limit";
import { ISwapTokenInfo } from "../../../data/types/repository/trade";

class OtherService {
  private _userModel: typeof UserModel;
  private _encryptionRepository: EncryptionRepository;

  constructor ({ userModel, tradeRepository, encryptionRepository, walletRepository, limitMarketModel} : {
    userModel: typeof UserModel;
    tradeRepository: TradeRepository;
    encryptionRepository: EncryptionRepository;
    walletRepository: WalletRepository;
    limitMarketModel: typeof LimitMarketModel;
  }){
    this._userModel = userModel;
    this._encryptionRepository = encryptionRepository;

  }

  public addReferralCode = async ({ token, referral_code, }:{
    token: string,
    referral_code: string;
  }) => {
    const decoded: any = this._encryptionRepository.decryptToken(token, TokenType.accessToken);
    if (!decoded?.telegram_id) return { errors: [{ message: 'Invalid request'}] };
    const user = await this._userModel.findOne({ telegram_id: decoded?.telegram_id });
    if (!user) return { errors: [{ message: 'user not found'}] };

    if (user.isReferralSent) {
      return { errors: [{ message: 'referral has been sent to user' }]};
    }

    const userResponse = this._userModel.find({ "referal.referalCode": referral_code}, {
      "referal.totalReferrals": { $inc: 1 },
      "referal.totalEarnings": { $inc: 1 },
      "referal.claimableEarnings": { $inc: 1 },
    })
    if ( !userResponse ) {
      return { errors: [{ message: 'unable to place trade' }]};
    }

    return { userResponse };
  };

}

export default OtherService;
