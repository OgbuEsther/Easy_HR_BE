import mongoose from "mongoose";

export interface adminSignUp extends mongoose.Document {
  viewUser: mongoose.Types.Array<mongoose.Types.ObjectId>;
  OTP : string;
  verified : boolean;
  token : string
   companyname: string;
   email: string;
   yourName: string;
   password: string;
   wallet: {}[];
   transactionHistory: {}[];
   walletNumber: number;
   companyCode: string
   SetAttendance : {}[]
   payRoll : []
  // ... other fields ...
}

export interface staffSignUp {
  yourName: string;
  email: string;
  password: string;
  plans:boolean;
  amount:number;
  companyname: string;
  position: string;
  walletNumber: number;
  subscribe :boolean,
  companyCode: string
  OTP : string;
  verified : string;
  token : string
  wallet: {}[];
  transactionHistory: {}[];
  savingsPlan: {}[];
  houseRentPlan: {}[];
  schoolFeesPlan: {}[];
  investmentPlan: {}[];
  travelAndTour: {}[];
  other: {}[];
  // payRoll : {}[]
  payRoll : []
  Attendance : {}[]
}
