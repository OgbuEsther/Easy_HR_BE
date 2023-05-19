import { Document, Schema, model } from "mongoose";
import { staffLeaveProps } from "../../staff";



interface staffLeave extends staffLeaveProps, Document {}

const staffSchema = new Schema<staffLeaveProps>({
  title: {
    type: String,
  },
 startDate :{
    type: String, 
 },
 numberOfDays : {
    type : Number
 },
 remainingDays : {
    type : Number
 },
 reason : {
    type : String
 },
 approved:{
    type: Boolean
 }
} , {timestamps:true});

const approvedLeave = model<staffLeave>("staffLeave", staffSchema);

export default approvedLeave;
