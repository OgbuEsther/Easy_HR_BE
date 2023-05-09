import adminAuth from "../../model/admin/adminAuth";
import {Request , Response } from "express"


export const PerformanceMilestone = async (req: Request, res: Response) => {
    try {
      const getAdmin = await adminAuth.findById(req.params.adminId);

      if (getAdmin){
        const dataFIle = await adminAuth.findByIdAndUpdate(
            getAdmin?._id,
            {
              $push: { createPerformanceMilestone: req.body },
            },
            { new: true }
          );
          dataFIle?.createPerformanceMilestone.sort((a, b) => a - b);
    
          const getMilestone = getAdmin?.createPerformanceMilestone![0];
    
          let totalSum = 0;
      
          const keys = Object.keys(getMilestone!);
          for (let i = 0; i < keys.length; i++) {
            totalSum += getMilestone![keys[i]];
          }
    
          if(totalSum > 100){
            return res.status(400).json({
                message : "Total performance rating shouldn't be above 100%"
            })
          }else{
            return res.status(201).json({ 
                message: "created Performance Milestone",
                data: dataFIle?.createPerformanceMilestone,
                totalScore : totalSum
              });
          }
      
      }else{
        return res.status(404).json({
            message : "Admin not found"
        })
      }
  
    
     
    } catch (error: any) {
      return res.status(400).json({
        message: "couldn't create  performance milestone",
        err: error.message,
        data: error,
      });
    }
  };


