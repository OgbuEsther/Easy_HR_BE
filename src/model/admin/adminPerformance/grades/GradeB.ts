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

const gradeBModel = mongoose.model<allGrades>("gradeBColl" ,gradeSchema )


export default gradeBModel