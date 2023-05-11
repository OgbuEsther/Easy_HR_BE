import adminAuth from "../../model/admin/adminAuth";
import { Request, Response } from "express";
import mileStoneModel from "../../model/admin/adminPerformance/adminPerfomanceModel";
import mongoose from "mongoose";
import rateModel from "../../model/admin/adminPerformance/Rate";
import gradeDModel from "../../model/admin/adminPerformance/grades/GradeD";
import gradeCModel from "../../model/admin/adminPerformance/grades/GradesC";
import gradeBModel from "../../model/admin/adminPerformance/grades/GradeB";
import staffAuth from "../../model/staff/staffAuth";
import gradeAModel from "../../model/admin/adminPerformance/grades/GradeA";

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

    const getvalue: number = parseInt(getCurrentDate);
    console.log(getvalue);

    if (getvalue >= 1 && getvalue === 10) {
      const getAdmin = await adminAuth.findById(req.params.adminId);

      const milestone = await mileStoneModel.create({
        mileStone,
      });

      await getAdmin?.PerformanceMilestone?.push(
        new mongoose.Types.ObjectId(milestone?._id)
      );

      await getAdmin?.save();

      return res.status(200).json({
        message: "milestone created",
        data: milestone,
      });
    } else {
      return res.status(400).json({
        message: "it's past creation time ",
      });
    }
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
      adminGrade: 0,
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
    const findStaff = await staffAuth.findById(req.params.staffId)
    const getRateModel = await rateModel.findById(req.params.rateId);

    const updateScore = await rateModel.findByIdAndUpdate(
      getRateModel?._id,
      {
        adminScore,
      },
      { new: true }
    );


    //from 1-26
    if (getRateModel?.adminScore! >= 1 && getRateModel?.adminScore! <= 25) {
      const getGrade = await gradeDModel.create({
        grade: "VERY POOR",
        score : getRateModel?.adminScore
      });
      await getRateModel?.gradeD?.push(new mongoose.Types.ObjectId(getGrade?._id))
      await getRateModel?.save()

      return res.status(201).json({
        message :` Your grade for this month is ${getGrade?.grade} `,
        data : getGrade
      })

      //from 26-50
    }else if(getRateModel?.adminScore! >= 26 && getRateModel?.adminScore! <=50){
      const getGrade = await gradeCModel.create({
        grade: "POOR",
        score : getRateModel?.adminScore
      });
      await getRateModel?.gradeC?.push(new mongoose.Types.ObjectId(getGrade?._id))
      await getRateModel?.save()

      return res.status(201).json({
        message :` Your grade for this month is ${getGrade?.grade} `,
        data : getGrade
      })

      //from 51 -75
    }else if(getRateModel?.adminScore! >= 51 && getRateModel?.adminScore! <=75){
      const getGrade = await gradeBModel.create({
        grade: "GOOD",
        score : getRateModel?.adminScore
      });
      await getRateModel?.gradeB?.push(new mongoose.Types.ObjectId(getGrade?._id))
      await getRateModel?.save()

      return res.status(201).json({
        message :` Your grade for this month is ${getGrade?.grade} `,
        data : getGrade
      })
    }else{
      const getGrade = await gradeAModel.create({
        grade: "VERY GOOD",
        score : getRateModel?.adminScore
      });
      await getRateModel?.gradeA?.push(new mongoose.Types.ObjectId(getGrade?._id))
      await getRateModel?.save()

      return res.status(201).json({
        message :` Your grade for this month is ${getGrade?.grade} `,
        data : getGrade
      })
    }

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
