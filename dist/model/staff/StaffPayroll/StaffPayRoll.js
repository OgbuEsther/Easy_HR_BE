"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const payRollSchema = new mongoose_1.default.Schema({
    grossPay: {
        type: Number,
        required: true
    },
    netPay: {
        type: Number,
    },
    taxes: {
        type: Number
    },
    pension: {
        type: Number
    },
    medicals: {
        type: Number
    }
});
const payRollModel = mongoose_1.default.model("StaffPayRoll", payRollSchema);
exports.default = payRollModel;
