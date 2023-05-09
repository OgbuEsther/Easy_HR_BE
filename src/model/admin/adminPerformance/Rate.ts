import { rateMe } from "../admindashboard";
import mongoose from "mongoose";


interface rate  extends rateMe , mongoose.Document{}


const rateSchema = new mongoose.Schema<rateMe>({
    adminScore :{
        type : Number
    },
    date : {
type : String
    },
    staffScore :{
        type :Number
    }
})


const rateModel = mongoose.model<rate>("ViewRatings" ,rateSchema)

export default rateModel