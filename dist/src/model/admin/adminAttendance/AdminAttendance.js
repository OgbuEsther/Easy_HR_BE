"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminAttendanceSchema = new mongoose_1.default.Schema({
    setToken: {
        type: String,
    },
});
const adminAttendanceModel = mongoose_1.default.model("Attendance", adminAttendanceSchema);
exports.default = adminAttendanceModel;
