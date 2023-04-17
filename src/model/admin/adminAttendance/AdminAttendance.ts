import mongoose from "mongoose";

import { adminAttendance } from "../admindashboard";

interface admin extends adminAttendance , mongoose.Document{}

const adminAttendanceSchema = new mongoose.Schema<adminAttendance>({
setToken : {
    type : String,
},
viewStaffAttendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffAttendance",
    },
  ],

})