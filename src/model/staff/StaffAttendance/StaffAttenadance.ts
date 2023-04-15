
import mongoose from "mongoose";

import { Attendance } from "../staffDashboard";


interface IAttend extends Attendance , mongoose.Document{}


const AttendanceSchema = new mongoose.Schema<Attendance>({
    date : {
        type : String
    },
    
    clockIn : {
        type : String
    },
    clockOut : {
        type : String
    },
    message : {
        type : String
    },
    time : {
        type : String
    },

})

const AttendanceModel = mongoose.model<IAttend>("StaffAttendance" , AttendanceSchema)

export default AttendanceModel