import mongoose from "mongoose";
import { milestoneGenerator } from "../admindashboard";

interface milestone extends milestoneGenerator, mongoose.Document {}

const milestoneSchema = new mongoose.Schema({
    mileStone : {
        type : String
    },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViewRatings",
    },
  ],
});

const mileStoneModel = mongoose.model("MileStone", milestoneSchema);

export default mileStoneModel;
