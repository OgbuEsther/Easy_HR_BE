
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
    nameOfStaff : {
        type : String
    },
staffId : {
    type : String
}

})

const LateAttendanceModel = mongoose.model<IAttend>("viewLateStaff" , AttendanceSchema)

export default LateAttendanceModel