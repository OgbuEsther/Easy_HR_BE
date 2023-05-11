"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const rateSchema = new mongoose_1.default.Schema({
    adminScore: {
        type: Number,
    },
    date: {
        type: String,
    },
    yourName: {
        type: String,
    },
    staffScore: {
        type: Number,
    },
    gradeA: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "gradeAColl",
        }
    ],
    gradeB: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "gradeBColl",
        }
    ],
    gradeC: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "gradeCColl",
        }
    ],
    gradeD: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "gradeDColl",
        }
    ]
});
const rateModel = mongoose_1.default.model("ViewRatings", rateSchema);
exports.default = rateModel;
