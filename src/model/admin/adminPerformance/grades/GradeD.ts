import mongoose from "mongoose"

import { grades } from "../../admindashboard"

interface allGrades extends grades , mongoose.Document{}

const gradeSchema = new mongoose.Schema({
    score : {
        type : Number
    },
    grade : {
        type : String
    }
} , {timestamps : true})

const gradeDModel = mongoose.model<allGrades>("gradeDColl" ,gradeSchema )


export default gradeDModel