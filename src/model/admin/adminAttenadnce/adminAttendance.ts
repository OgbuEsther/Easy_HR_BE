
import mongoose from "mongoose";

import { Attendance } from "../../staff";


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

})

const AdminAttendanceModel = mongoose.model<IAttend>("Attendance" , AttendanceSchema)

export default AdminAttendanceModel