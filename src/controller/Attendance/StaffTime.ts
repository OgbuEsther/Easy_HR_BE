import { Request, Response } from "express";
import AttendanceModel from "../../model/staff/StaffAttendance/StaffAttenadance";
import staffAuth from "../../model/staff/staffAuth";
import mongoose from "mongoose";
import crypto from "crypto"
import adminAttendanceModel from "../../model/admin/adminAttendance/AdminAttendance";
import adminAuth from "../../model/admin/adminAuth";
import { get } from "http";

export const createAttendance = async(req:Request , res:Response)=>{
  try {
   
    const getAdmin = await adminAuth.findById(req.params.adminId)

  if(getAdmin){
    const token = await crypto.randomBytes(3).toString("hex")

    const createToken = await adminAttendanceModel.create({
      setToken :token,
      // _id : getAdmin?._id
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
  } catch (error:any) {
    return res.status(400).json({
      message: "an error in creating attendance",
      data : error,
      error : error.message
    });
  }
}

//clock in time
export const createClockIn = async (req: Request, res: Response) => {
  try {
    const { date, clockIn, message, time , setToken } = req.body;

    const getStaff = await staffAuth.findById(req.params.staffId);
const getAdmin = await adminAuth.findById(req.params.adminId)
    const getAdminAttendanceToken = await adminAttendanceModel.findOne(
      {setToken}
    )

    const getDate = new Date().toLocaleDateString();

    const getTime = new Date().toLocaleTimeString();

    const customMessage = `you clocked in at ${getTime} on ${getDate} , make sure to clock out at the right time`;

    if(getStaff && getAdmin){
      if(getAdminAttendanceToken?.setToken === setToken ){
        const clockInTime = await AttendanceModel.create({
          date: getDate,
          clockIn,
          clockOut: false,
          message: customMessage,
          time: getTime,
          token :setToken,
          _id : getStaff?._id
        });
  
        await getStaff?.Attendance?.push(
          new mongoose.Types.ObjectId(clockInTime?._id)
        );
        await getStaff?.save();

        

        await getAdminAttendanceToken?.viewStaffAttendance.push(new mongoose.Types.ObjectId(clockInTime?._id))

        await getAdminAttendanceToken?.save()

        await getAdmin?.viewStaffHistory?.push(new mongoose.Types.ObjectId(clockInTime?._id))

        getAdmin.viewStaffHistory.push(new mongoose.Types.ObjectId(clockInTime?._id))
       



        await getAdmin?.save()

        await getAdmin?.viewAbsentStaff?.pull(new mongoose.Types.ObjectId(clockInTime?._id))

        await getAdmin?.save()

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
        message : "couldn't get staff or admin"
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
    const { date, clockOut, message, time , setToken } = req.body;

    const getDate = new Date().toLocaleDateString();

    const getTime = new Date().toLocaleTimeString();

    
    const getAdminAttendanceToken = await adminAttendanceModel.findOne({setToken})

    const customMessage = `you clocked out at ${getTime} on ${getDate}`;

    const getStaff = await staffAuth.findById(req.params.staffId);
    const getAdmin = await adminAuth.findById(req.params.adminId)

    if (getStaff && getAdmin) {
      if(getAdminAttendanceToken?.setToken === setToken ){
        const clockOutTime = await AttendanceModel.create({
          date: getDate,
          clockOut ,
          clockIn: false,
          message: customMessage,
          time: getTime,
          token :setToken
        });
  

        await getStaff?.Attendance?.push(
          new mongoose.Types.ObjectId(clockOutTime?._id)
        );
        await getStaff?.save();

        await getAdminAttendanceToken?.viewStaffAttendance.push(new mongoose.Types.ObjectId(clockOutTime?._id))

        await getAdminAttendanceToken?.save()

        return res.status(201).json({
          message: "clockOutTime done",
          data: clockOutTime,
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
      message: "staff couldn't clocked out",
    });
  }
};
