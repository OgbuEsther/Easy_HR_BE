import mongoose from "mongoose"
import { PayRoll } from "../staffDashboard/staffModel";

interface payroll extends PayRoll , mongoose.Document{}

// const payRollSchema = new mongoose.Schema<PayRoll>({
const payRollSchema = new mongoose.Schema<PayRoll>({
    grossPay : {
        type : Number,
        required : true
    },

    expenses:[],
    
    netPay : {
        type : Number,
    },
  
    
})


const payRollModel = mongoose.model<payroll>("StaffPayRoll" , payRollSchema)


export default payRollModel