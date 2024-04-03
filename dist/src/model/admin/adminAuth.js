"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminAuth = new mongoose_1.default.Schema({
    companyCode: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    expectedClockIn: {
        type: String
    },
    expectedClockOut: {
        type: String
    },
    lastTokenTimestamp: { type: Date, default: new Date(0) },
    workingDays: {
        type: String
    },
    companyname: {
        type: String,
        unique: true
    },
    OTP: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [true, "please enter your company email"],
        trim: true,
        lowercase: true,
    },
    yourName: {
        type: String,
        required: [true, "please enter your name"],
    },
    password: {
        type: String,
        required: [true, "please enter a password"],
    },
    walletNumber: Number,
    wallet: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "adminWallet",
        },
    ],
    transactionHistory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "adminTransactionHistory",
        },
    ],
    viewUser: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffAuth",
        }
    ],
    SetAttendance: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Attendance",
        },
    ],
    payRoll: [],
    PerformanceMilestone: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "mileStones",
        },
    ],
    mainPayRoll: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "StaffPayRoll",
        },
    ],
    adminLeave: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "adminLeave",
        },
    ],
    viewStaffHistory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "StaffAttendance",
        },
    ],
    viewAbsentStaff: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffAuth",
        },
    ],
    viewLateStaff: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "viewLateStaff",
        },
    ],
    viewStaffAttendance: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "StaffAttendance",
        },
    ],
    staffLeave: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffLeave",
        },
    ],
    viewApprovedLeave: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffLeave",
        },
    ],
    viewRejectedLeave: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffLeave",
        },
    ],
}, { timestamps: true });
const adminAuth = mongoose_1.default.model("adminAuthModel", AdminAuth);
exports.default = adminAuth;
