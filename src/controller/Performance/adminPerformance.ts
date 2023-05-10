import adminAuth from "../../model/admin/adminAuth";
import { Request, Response } from "express";
import mileStoneModel from "../../model/admin/adminPerformance/adminPerfomanceModel";
import mongoose from "mongoose";
import rateModel from "../../model/admin/adminPerformance/Rate";

export const PerformanceMilestone = async (req: Request, res: Response) => {
  try {
    const getAdmin = await adminAuth.findById(req.params.adminId);

    if (getAdmin) {
      const dataFIle = await adminAuth.findByIdAndUpdate(
        getAdmin?._id,
        {
          $push: { createPerformanceMilestone: req.body },
        },
        { new: true }
      );

      const getMilestone = getAdmin?.createPerformanceMilestone![0];

      let totalSum = 0;

      const keys = Object.keys(getMilestone!);
      for (let i = 0; i < keys.length; i++) {
        totalSum += getMilestone![keys[i]];
      }

      console.log("thi is total sum", totalSum > 100);
      //   dataFIle?.createPerformanceMilestone.sort

      if (totalSum > 100) {
        return res.status(400).json({
          message: "Total performance rating shouldn't be above 100%",
        });
      } else {
        return res.status(201).json({
          message: "created Performance Milestone",
          data: dataFIle?.createPerformanceMilestone,
          totalScore: totalSum,
          //   okay :(totalSum += getMilestone![keys[i]])
        });
      }
    } else {
      return res.status(404).json({
        message: "Admin not found",
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "couldn't create  performance milestone",
      err: error.message,
      data: error,
    });
  }
};

export const createMileStone = async (req: Request, res: Response) => {
  try {
    const { mileStone } = req.body;

    function getDaysInMonth(year: any, month: any) {
      return new Date(year, month, 0).getDate();
    }

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; // 👈️ months are 0-based

    // 👇️ Current Month
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    console.log(daysInCurrentMonth);
  
    //get actual date
    const getCurrentDate = new Date().toLocaleDateString().split("")[2];

    const getvalue:number = parseInt(getCurrentDate);
    console.log(getvalue);


    // if (getvalue >= 1 && getvalue === 4) {
      const getAdmin = await adminAuth.findById(req.params.adminId);

      const milestone = await mileStoneModel.create({
        mileStone,
      });

      await getAdmin?.createPerformanceMilestone?.push(
        new mongoose.Types.ObjectId(milestone?._id)
      );

      await getAdmin?.save();

      return res.status(200).json({
        message: "milestone created",
        data: milestone,
      });
    // } else {
    //   return res.status(400).json({
    //     message: "it's past creation time ",
    //   });
    // }
  } catch (error: any) {
    return res.status(400).json({
      message: "milestone not created",
      data: error,
      err: error.message,
    });
  }
};

export const enterStaffScore = async (req: Request, res: Response) => {
  try {
    const { staffScore } = req.body;
    const createStaffScore = await rateModel.create({
      adminScore: 0,
      staffScore,
      // date : Date.getDate()
    });

    return res.status(201).json({
      message: "entered score sucessfully",
      data: createStaffScore,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to enter score",
      data: error,
      err: error.message,
    });
  }
};

export const enterAdminScore = async (req: Request, res: Response) => {
  try {
    const { adminScore } = req.body;
    const getRateModel = await rateModel.findById(req.params.rateId);

    const updateScore = await rateModel.findByIdAndUpdate(
      getRateModel?._id,
      {
        adminScore,
      },
      { new: true }
    );

    return res.status(201).json({
      message: "entered score sucessfully",
      data: updateScore,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to enter score",
      data: error,
      err: error.message,
    });
  }
};
