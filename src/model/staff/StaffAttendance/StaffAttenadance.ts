
import mongoose from "mongoose";

import { Attendance } from "../staffDashboard";


interface IAttend extends Attendance , mongoose.Document{}


const AttendanceSchema = new mongoose.Schema<Attendance>({
    date : {
        type : String
    },
    
    clockIn : {
        type : Boolean,
        default : false
    },
    clockOut : {
        type : Boolean,
        default : false
    },
    message : {
        type : String
    },
    time : {
        type : String
    },
    token : {
        type : String
    },
    // latitude : {
    //     type : String
    // },
    // longitude : {
    //     type : String
    // },
    nameOfStaff : {
        type : String
    },

})

const AttendanceModel = mongoose.model<IAttend>("StaffAttendance" , AttendanceSchema)

export default AttendanceModel