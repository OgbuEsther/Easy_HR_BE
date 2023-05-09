import adminAuth from "../../model/admin/adminAuth";
import {Request , Response } from "express"


export const PerformanceMilestone = async (req: Request, res: Response) => {
    try {
      const getAdmin = await adminAuth.findById(req.params.adminId);
  
      const dataFIle = await adminAuth.findByIdAndUpdate(
        getAdmin?._id,
        {
          $push: { createPerformanceMilestone: req.body },
        },
        { new: true }
      );
      dataFIle?.createPerformanceMilestone.sort((a, b) => a - b);
  
      return res.status(201).json({ 
        message: "created Performance Milestone",
        data: dataFIle?.payRoll,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: "couldn't create  performance milestone",
        err: error.message,
        data: error,
      });
    }
  };