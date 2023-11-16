import { Schema, model, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IOtherWallet {
    coin_name: string;
    contract_address: string;
    balance: number;
}

export interface IWallet {
    private_key: string;
    address: string;
    seed_phrase?: string;
    public_key?: string;
    balance: number;
    others: IOtherWallet[]
}

export interface IUser {
    _id?: string;
    name?: string;
    telegram_id: string;
    wallets: IWallet[],
    referal: {
        referalCode: string;
        totalReferrals: number;
        totalEarnings: number;
        totalGoatHeld: number;
        claimableEarnings: number;
    };
    passcode?: string;
    previous_command: string;
}


const OtherWalletSchema = new Schema<IOtherWallet>({
    coin_name: {
        type: String,
    },
    contract_address: {
        type: String,
    },
    balance: {
        type: Number,
    },
})

const WalletSchema = new Schema<IWallet>({
    private_key: {
        type: String,
    },
    address: {
        type: String,
    },
    seed_phrase: {
        type: String,
    },
    public_key: {
        type: String,
    },
    balance: {
        type: Number,
    },
    others: {
        type: [OtherWalletSchema],
        default: []
    }
})

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
    },
    telegram_id: {
        type: String,
    },
    wallets: [WalletSchema],
    referal: {
        referalCode: String,
        totalReferrals: Number,
        totalEarnings: Number,
        claimableEarnings: Number,
        totalGoatHeld: Number,
    },
    passcode: {
        type: String,
    },
    previous_command: {
        type: String,
    }
});

UserSchema.plugin(mongoosePaginate);

export const UserModel = model<IUser, PaginateModel<IUser>>("User", UserSchema);
