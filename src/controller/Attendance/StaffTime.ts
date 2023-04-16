import { Request, Response } from "express";
import AttendanceModel from "../../model/staff/StaffAttendance/StaffAttenadance";
import staffAuth from "../../model/staff/staffAuth";
import mongoose from "mongoose";

//clock in time
export const createClockIn = async (req: Request, res: Response) => {
  try {
    const { date, clockIn, message, time } = req.body;

    const getStaff = await staffAuth.findById(req.params.staffId);

    const getDate = new Date().toLocaleDateString();

    const getTime = new Date().toLocaleTimeString();

    const customMessage = `you clocked in at ${getTime} on ${getDate} , make sure to clock out at the right time`;

    if (getStaff) {
      const clockInTime = await AttendanceModel.create({
        date: getDate,
        clockIn,
        message: customMessage,
        time: getTime,
      });

      await getStaff?.payRoll?.push(
        new mongoose.Types.ObjectId(clockInTime?._id)
      );
      await getStaff?.save();
      return res.status(201).json({
        message: "clockInTime done",
        data: clockInTime,
      });
    } else {
      return res.status(400).json({
        message: "not a signed in staff",
      });
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

      await getStaff?.payRoll?.push(
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
