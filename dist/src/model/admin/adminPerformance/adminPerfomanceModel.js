"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const milestoneSchema = new mongoose_1.default.Schema({
    mileStone: {
        type: String
    },
    ratings: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "ViewRatings",
        },
    ],
});
const mileStoneModel = mongoose_1.default.model("MileStone", milestoneSchema);
exports.default = mileStoneModel;
