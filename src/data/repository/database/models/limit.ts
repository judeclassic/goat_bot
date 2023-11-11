import { Schema, model} from "mongoose";
import { Document, Types, ObjectId } from "mongoose";

export interface ILimit extends Document {
    _id: ObjectId;
    userId: string;
    marketType: string;
    amount: number;
    walletAddress: string;
    contractAddress: string;
    slippage: number;
    createdAt: Date;
    updatedAt: Date;
}

const LimitSchema = new Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      marketType: {
        type: String,
        enum: ["buy", "sell"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      walletAddress: {
        type: String,
        required: true,
      },
      contractAddress: {
        type: String,
        required: true,
      },
      slippage: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }, 
    },
    {
      timestamps: true,
    }
);


  
export const LimitMarketModel = model<ILimit>("LimitMarket", LimitSchema);
  