import { Request, Response } from "express";
import staffLeaveModel from "../../model/staff/staffLeave/staffLeave";
import adminLeaveModel from "../../model/admin/adminLeave/adminLeave";
import adminAuth from "../../model/admin/adminAuth";
import mongoose from "mongoose";
import staffAuth from "../../model/staff/staffAuth";

//admin to create leave

export const createLeave = async (req: Request, res: Response) => {
  try {
    const getAdmin = await adminAuth.findById(req.params.adminId);


   

    const { title, days } = req.body;
    const getLeave = await adminLeaveModel.findOne({title})
    if (getAdmin) {
      if (getLeave?.title === title) {
        return res.status(400).json({
          message:
            "this is a bad request , leave already exists , no need of creating two leaves with the same name",
        });
      } else {
        const createNewLeave = await adminLeaveModel.create({
          title,
          days,
        });

        getAdmin?.adminLeave?.push(
          new mongoose.Types.ObjectId(createNewLeave?._id)
        );
        getAdmin?.save();

        return res.status(201).json({
          message:
            "you have just created a leave for your company .....congrats!!!",
          data: createNewLeave,
        });
      }
    } else {
      return res.status(404).json({
        message:
          "you are not a registered admin yet , try signing up to create a leave",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "an error occurred while creating leave",
      errMsg: error.message,
      data: error,
    });
  }
};

//STAFF SIDE !!!!
//THIS IS THE STAFF APPLIES FOR A LEAVE

export const applyForLeave = async (req: Request, res: Response) => {
  try {
    const { title, startDate, numberOfDays, reason } = req.body;

    const getStaff = await staffAuth.findById(req.params.staffId);

    const getLeave = await adminLeaveModel.findOne({ title });
const getAdmin = await adminAuth.findById(req.params.adminId)
    if (getStaff && getAdmin) {
      if (getLeave?.title === title) {
        const apply = await staffLeaveModel.create({
          title,
          startDate,
          numberOfDays,
          remainingDays: getLeave?.days! - numberOfDays,
          reason,
          approved : false
        });

        getStaff?.staffLeave?.push(new mongoose.Types.ObjectId(apply?._id));

        getStaff?.save();
        getAdmin?.viewAppliedLeave.push(new mongoose.Types.ObjectId(apply?._id))

        getAdmin?.save()
        return res.status(201).json({
          message: "created application successfully",
          data: apply,
        });
      } else {
        return res.status(400).json({
          message: "leave title doesn't match",
        });
      }
    } else {
      return res.status(404).json({
        message:
          "you are not a registered staff yet , try signing up to create a leave",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "an error occurred while creating leave",
      errMsg: error.message,
      data: error,
    });
  }
};
