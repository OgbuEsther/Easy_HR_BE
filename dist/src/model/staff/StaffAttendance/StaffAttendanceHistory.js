"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const StaffAuth = new mongoose_1.default.Schema({
    companyCode: {
        type: String,
    },
    staffToken: {
        type: String,
    },
    yourName: {
        type: String,
        required: [true, "please enter your name"],
    },
    plans: {
        type: Boolean,
    },
    amount: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    companyname: {
        type: String,
    },
    position: {
        type: String,
    },
    walletNumber: {
        type: Number,
    },
    wallet: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffWallet",
        },
    ],
    transactionHistory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffTransactionHistory",
        },
    ],
    // savingsPlan: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "staffSavingsPlan",
    //   },
    // ],
    // houseRentPlan: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "staffHousePlan",
    //   },
    // ],
    // schoolFeesPlan: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "staffSchoolFeesPlan",
    //   },
    // ],
    // investmentPlan: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "staffInvestmentPlan",
    //   },
    // ],
    // travelAndTour: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "staffTravelAndTour",
    //   },
    // ],
    // other: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "staffOther",
    //   },
    // ],
    payRoll: [],
    Attendance: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "StaffAttendance",
        },
    ],
    mainPayRoll: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "StaffPayRoll",
        },
    ],
    staffLeave: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffLeave",
        },
    ],
}, { timestamps: true });
const viewStaffHistory = mongoose_1.default.model("StaffAttendanceHistory", StaffAuth);
exports.default = viewStaffHistory;
