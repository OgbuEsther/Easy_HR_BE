import { Document, Schema, model } from "mongoose";
import { staffLeaveProps } from "../staffDashboard";

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
 reason : {
    type : String
 }
});

const staffLeaveModel = model<staffLeave>("staffLeave", staffSchema);

export default staffLeaveModel;
