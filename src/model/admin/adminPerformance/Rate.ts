import { rateMe } from "../admindashboard";
import mongoose from "mongoose";

interface rate extends rateMe, mongoose.Document {}

const rateSchema = new mongoose.Schema<rateMe>({
  adminScore: {
    type: Number,
  },
  date: {
    type: String,
  },
  yourName: {
    type: String,
  },
  staffScore: {
    type: Number,
  },
  gradeA : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gradeAColl",
    }
  ],
  gradeB : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gradeBColl",
    }
  ],
  gradeC : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gradeCColl",
    }
  ],
  gradeD : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gradeDColl",
    }
  ]
});

const rateModel = mongoose.model<rate>("ViewRatings", rateSchema);

export default rateModel;
