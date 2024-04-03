import mongoose from "mongoose";
import { adminSignUp } from "../allinterfaces";

interface iAuth extends adminSignUp, mongoose.Document {}

const AdminAuth = new mongoose.Schema<adminSignUp>(
  {
    companyCode : {
      type : String,
    },
    latitude : {
      type : String,
    },
    longitude : {
      type : String,
    
    },
    expectedClockIn : {
      type : String
    },
    expectedClockOut : {
      type : String
    },
    lastTokenTimestamp: { type: Date, default: new Date(0) },
    workingDays : {
      type : String
    },
    companyname: {
      type: String,
      unique:true

    },
    OTP: {
      type :String
    },
    verified: {
      type : Boolean,
      default : false
    },
    token : {
      type : String
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
    walletNumber : Number,
    wallet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "adminWallet",
      },
    ],
    transactionHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "adminTransactionHistory",
      },
    ],
  viewUser :[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffAuth",
    }
  ],
  SetAttendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
  ],
  payRoll: [
    
  ],

  PerformanceMilestone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mileStones",
    },
    
  ],
  mainPayRoll : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffPayRoll",
    },
  ],
  adminLeave : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminLeave",
    },
  ],
  viewStaffHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffAttendance",
    },
  ],
  viewAbsentStaff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffAuth",
    },
  ],
  viewLateStaff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "viewLateStaff",
    },
  ],
  viewStaffAttendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffAttendance",
    },
  ],
  staffLeave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffLeave",
    },
  ],
  viewApprovedLeave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffLeave",
    },
  ],
  viewRejectedLeave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffLeave",
    },
  ],
  },
  { timestamps: true }
);

const adminAuth = mongoose.model<iAuth>("adminAuthModel", AdminAuth);

export default adminAuth;
