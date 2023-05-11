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

const gradeCModel = mongoose.model<allGrades>("gradeCColl" ,gradeSchema )


export default gradeCModel