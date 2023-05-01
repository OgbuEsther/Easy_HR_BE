import { Document, Schema, model } from "mongoose";
import { adminLeaveProps } from "../admindashboard";

interface adminLeave extends adminLeaveProps, Document {}

const adminSchema = new Schema<adminLeaveProps>({
  title: {
    type: String,
  },
  days: {
    type: Number,
  },
});

const adminLeaveModel = model<adminLeave>("adminLeave", adminSchema);

export default adminLeaveModel;
