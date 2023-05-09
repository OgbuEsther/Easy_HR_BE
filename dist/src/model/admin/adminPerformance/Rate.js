"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const rateSchema = new mongoose_1.default.Schema({
    adminScore: {
        type: Number
    },
    date: {
        type: String
    },
    staffScore: {
        type: Number
    }
});
const rateModel = mongoose_1.default.model("ViewRatings", rateSchema);
exports.default = rateModel;
