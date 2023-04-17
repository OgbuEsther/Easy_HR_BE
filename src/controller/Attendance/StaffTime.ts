import { Request, Response } from "express";
import AttendanceModel from "../../model/staff/StaffAttendance/StaffAttenadance";
import staffAuth from "../../model/staff/staffAuth";
import mongoose from "mongoose";
import crypto from "crypto"
import adminAttendanceModel from "../../model/admin/adminAttendance/AdminAttendance";
import adminAuth from "../../model/admin/adminAuth";

export const createAttendance = async(req:Request , res:Response)=>{
  try {
   
    const getAdmin = await adminAuth.findById(req.params.adminId)

  if(getAdmin){
    const token = await crypto.randomBytes(3).toString("hex")

    const createToken = await adminAttendanceModel.create({
      setToken :token
    })

    await getAdmin?.SetAttendance?.push(new mongoose.Types.ObjectId(createToken?._id))

    await getAdmin?.save()

    return res.status(201).json({
      message : "create staff token successfully",
      data : createToken
    })
  }else{
    return res.status(400).json({
      message: "admin not found",
  
    });
  }
  } catch (error) {
    return res.status(400).json({
      message: "an error in creating attendance",
      data : error
    });
  }
}

//clock in time
export const createClockIn = async (req: Request, res: Response) => {
  try {
    const { date, clockIn, message, time , token } = req.body;

    const getStaff = await staffAuth.findById(req.params.staffId);

    const getAdminAttendanceToken = await adminAttendanceModel.findById(req.params.timeId)

    const getDate = new Date().toLocaleDateString();

    const getTime = new Date().toLocaleTimeString();

    const customMessage = `you clocked in at ${getTime} on ${getDate} , make sure to clock out at the right time`;

    if(getStaff){
      if(getAdminAttendanceToken?.setToken === token ){
        const clockInTime = await AttendanceModel.create({
          date: getDate,
          clockIn,
          clockOut: false,
          message: customMessage,
          time: getTime,
          token
        });
  
        await getStaff?.Attendance?.push(
          new mongoose.Types.ObjectId(clockInTime?._id)
        );
        await getStaff?.save();
        return res.status(201).json({
          message: "clockInTime done",
          data: clockInTime,
        });
      }else{
        return res.status(400).json({
          message : "token doesn't match"
        })
      }
    }else{
      return res.status(400).json({
        message : "couldn't get staff"
      })
    }
  } catch (error) {
    return res.status(400).json({
      message: "staff couldn't clocked in",
    });
  }
};

//clock Out time
export const createClockOut = async (req: Request, res: Response) => {
  try {
    const { date, clockOut, message, time } = req.body;

    const getDate = new Date().toLocaleDateString();

    const getTime = new Date().toLocaleTimeString();

    const customMessage = `you clocked out at ${getTime} on ${getDate}`;

    const getStaff = await staffAuth.findById(req.params.staffId);

    if (getStaff) {
      const clockOutTime = await AttendanceModel.create({
        date: getDate,
        clockOut,
        message: customMessage,
        time: getTime,
      });

      await getStaff?.Attendance?.push(
        new mongoose.Types.ObjectId(clockOutTime?._id)
      );
      await getStaff?.save();
      return res.status(201).json({
        message: "clockOutTime done",
        data: clockOutTime,
      });
    } else {
      return res.status(400).json({
        message: "not a signed in staff",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "staff couldn't clocked out",
    });
  }
};
