import express,{ NextFunction, Request, Response } from "express";
import AttendanceModel from "../../model/staff/StaffAttendance/StaffAttenadance";
import staffAuth from "../../model/staff/staffAuth";
import mongoose from "mongoose";
import crypto from "crypto"
import adminAttendanceModel from "../../model/admin/adminAttendance/AdminAttendance";
import adminAuth from "../../model/admin/adminAuth";
import { get } from "http";
import LateAttendanceModel from "../../model/staff/StaffAttendance/StaffLateNess";
import ip from "ip";
import axios from "axios";
import { SuperfaceClient } from "@superfaceai/one-sdk";
const app = express();
app.set("trust proxy", true);


const sdk = new SuperfaceClient();

async function run(ip: any) {
  // Load the profile
  const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");

  // Use the profile
  const result = await profile.getUseCase("IpGeolocation").perform(
    {
      //   ipAddress: "102.88.34.40",
      ipAddress: ip,
    },
    {
      provider: "ipdata",
      security: {
        apikey: {
          apikey: "41b7b0ed377c175c4b32091abd68d049f5b6b748b2bee4789a161d93",
        },
      },
    },
  );

  // Handle the result
  try {
    const data = result.unwrap();
    return data;
  } catch (error) {
    console.error(error);
  }
}


export const createAttendance = async (req: Request, res: Response) => {
  try {
    // Find admin by ID
    const getAdmin = await adminAuth.findById(req.params.adminId);

    if (!getAdmin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    // Get the last generated token's timestamp
    const lastTokenTimestamp = getAdmin.lastTokenTimestamp || new Date(0);

    // Calculate the time difference since the last token was generated
    const timeDifference = new Date().getTime() - lastTokenTimestamp.getTime();

    // If less than 24 hours have passed since the last token generation, return an error
    if (timeDifference < 24 * 60 * 60 * 1000) {
      return res.status(400).json({
        message: "Cannot generate a new token before 24 hours have passed since the last token generation.",
      });
    }

    // Generate a new token
    const token = await crypto.randomBytes(3).toString("hex");

    // Create a new token record
    const createToken = await adminAttendanceModel.create({
      setToken: token,
    });

    // Update admin's last token timestamp
    getAdmin.lastTokenTimestamp = new Date();
    await getAdmin.save();

    return res.status(201).json({
      message: "Create staff token successfully",
      data: createToken,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "An error occurred in creating attendance",
      data: error,
      error: error.message,
    });
  }
};


//clock in time
export const createClockIn = async (req: Request, res: Response ,ip:any  ) => {
  try {

    


    const { date, clockIn, message, time , setToken } = req.body;

    const getStaff = await staffAuth.findById(req.params.staffId);
const getAdmin = await adminAuth.findById(req.params.adminId)
    const getAdminAttendanceToken = await adminAttendanceModel.findOne(
      {setToken}
    )
    
    let dataIP: any;

    await axios.get("https://api.ipify.org/").then((res: any) => {
      dataIP = res.data;
    });

    let realData: any = await run(dataIP);

    console.log(realData?.latitude);
    console.log(realData?.longitude);

    console.log(getAdmin?.latitude);
    console.log(getAdmin?.longitude);

    console.log(parseFloat(getAdmin?.latitude!));
    console.log(parseFloat(getAdmin?.longitude!));

    const getDate = new Date().toLocaleDateString();

    const getTime = new Date().toLocaleTimeString();

    const customMessage = `you clocked in at ${getTime} on ${getDate} , make sure to clock out at the right time`;

    
   console.log("this is parseFloat(getAdmin?.expectedClockIn! ) " ,parseFloat(getAdmin?.expectedClockIn! ))

   console.log("this is parseFloat(getTime)" ,parseFloat(getTime))
   console.log("this is (getAdmin?.expectedClockIn! ) " ,getAdmin?.expectedClockIn! )

   console.log("this is (getTime)" ,getTime)

    if(getStaff && getAdmin){


      if(getAdminAttendanceToken?.setToken === setToken ){
        if(getAdmin?.expectedClockIn! <= getTime){
          if (
            realData?.latitude === parseFloat(getAdmin?.latitude!) &&
            realData?.longitude === parseFloat(getAdmin?.longitude!)
          ) {
            const clockInTime = await AttendanceModel.create({
              date: getDate,
              clockIn,
              clockOut: false,
              message: customMessage,
              time: getTime,
              token :setToken,
              nameOfStaff : getStaff?.yourName,
              staffId : getStaff?.staffToken
            });
      
            await getStaff?.Attendance?.push(
              new mongoose.Types.ObjectId(clockInTime?._id)
            );
            await getStaff?.save();
    
            
    
            await getAdmin?.viewStaffAttendance.push(new mongoose.Types.ObjectId(clockInTime?._id))
    
            await getAdminAttendanceToken?.save()
    
          
    
            getAdmin.viewStaffHistory.push(new mongoose.Types.ObjectId(clockInTime?._id))
  
          
    
            await getAdmin?.viewAbsentStaff?.pull(new mongoose.Types.ObjectId(getStaff?._id))
    
            await getAdmin?.save()
    
            return res.status(201).json({
              message: "clockInTime done",
              data: clockInTime,
            });
          }
         
        }else if(getAdmin?.expectedClockIn! >= getTime){
          const clockInTime = await LateAttendanceModel.create({
            date: getDate,
            clockIn,
            clockOut: false,
            message: customMessage,
            time: getTime,
            token :setToken,
            nameOfStaff : getStaff?.yourName
          });
          getAdmin?.viewLateStaff?.push(new mongoose.Types.ObjectId(clockInTime?._id))
          return res.status(200).json({
            message : "you are late"

          })
        }else{
          return res.status(400).json({
            message : "you didn't punch in today"
          })
        }

        
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
  } catch (error:any) {
    return res.status(400).json({
      message: "staff couldn't clocked in",
      data : error,
      err : error?.message
      
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
          token :setToken,
          nameOfStaff : getStaff?.yourName
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
  } catch (error:any) {
    return res.status(400).json({
      message: "staff couldn't clocked out",
      data : error,
      err : error?.message
    });
  }
};
