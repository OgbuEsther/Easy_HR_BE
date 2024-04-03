"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AttendanceSchema = new mongoose_1.default.Schema({
    date: {
        type: String
    },
    clockIn: {
        type: Boolean,
        default: false
    },
    clockOut: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    },
    time: {
        type: String
    },
    token: {
        type: String
    },
    // latitude : {
    //     type : String
    // },
    // longitude : {
    //     type : String
    // },
    nameOfStaff: {
        type: String
    },
    staffId: {
        type: String
    },
    DEDUCTIONS: {
        type: String
    },
});
const AttendanceModel = mongoose_1.default.model("StaffAttendance", AttendanceSchema);
exports.default = AttendanceModel;
