"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const staffTransactionHistorySchema = new mongoose_1.default.Schema({
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
        type: Number
    }
}, { timestamps: true });
const staffTransactionHistory = mongoose_1.default.model("staffTransactionHistory", staffTransactionHistorySchema);
exports.default = staffTransactionHistory;
