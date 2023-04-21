import mongoose from "mongoose";
import { staffTransactionProps } from "./staffModel";
interface staff extends staffTransactionProps, mongoose.Document {}

const staffTransactionHistorySchema =
  new mongoose.Schema<staffTransactionProps>({
    message: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
    },
    
    date: {
      type: String,
    },
    transactionReference: {
      type: Number,
    },
    amount: {
      type : Number
    }
  }, {timestamps : true});
const staffTransactionHistory = mongoose.model<staff>(
  "staffTransactionHistory",
  staffTransactionHistorySchema
);

export default staffTransactionHistory;
