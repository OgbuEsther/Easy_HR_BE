"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gradeSchema = new mongoose_1.default.Schema({
    score: {
        type: Number
    },
    grade: {
        type: String
    }
}, { timestamps: true });
const gradeBModel = mongoose_1.default.model("gradeBColl", gradeSchema);
exports.default = gradeBModel;
