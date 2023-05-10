import mongoose from "mongoose";

import { adminAttendance } from "../admindashboard";

interface admin extends adminAttendance , mongoose.Document{}

const adminAttendanceSchema = new mongoose.Schema<adminAttendance>({
setToken : {
    type : String,
},




})

const adminAttendanceModel = mongoose.model<admin>("Attendance" ,adminAttendanceSchema )

export default adminAttendanceModel