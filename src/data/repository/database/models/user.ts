import { Schema, model, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IWallet {
    private_key: string;
    address: string;
    seed_phrase?: string;
    public_key?: string;
    balance: number
}

export interface IUser {
    _id?: string;
    name?: string;
    telegram_id: string;
    wallets: IWallet[],
    passcode?: string;
    previous_command: string;
}


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
})

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
    },
    telegram_id: {
        type: String,
    },
    wallets: [WalletSchema],
    passcode: {
        type: String,
    },
    previous_command: {
        type: String,
    }
});

UserSchema.plugin(mongoosePaginate);

export const UserModel = model<IUser, PaginateModel<IUser>>("User", UserSchema);
