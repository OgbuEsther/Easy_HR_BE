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
viewAbsentStaff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffAbsence",
    },
  ],


})

const adminAttendanceModel = mongoose.model<admin>("Attendance" ,adminAttendanceSchema )

export default adminAttendanceModel