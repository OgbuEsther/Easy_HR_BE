import adminAuth from "../model/admin/adminAuth";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import otpgenerator from "otp-generator";
import adminWalletModel from "../model/admin/admindashboard/adminWallets";
import { AppError, HttpCode } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import crypto from "crypto";
import staffAuth from "../model/staff/staffAuth";
import { verifyEmail } from "../utils/email";
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
    }
  );

  // Handle the result
  try {
    const data = result.unwrap();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export const adminSignup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction, ip: any) => {
    try {
      // Use the profile

      const {
        companyname,
        email,
        yourName,
        password,
        walletNumber,
        token,
        OTP,
      } = req.body;

      const genToken = crypto.randomBytes(32).toString("hex");
      const genOTP = crypto.randomBytes(2).toString("hex");

      if (!email || !yourName || !password) {
        return res.status(400).json({
          message: "please fill in the required fields",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const dater = Date.now();
      const defaultTime = "07:30:00 PM";

      let dataIP: any;

      await axios.get("https://api.ipify.org/").then((res: any) => {
        dataIP = res.data;
      });

      let realData: any = await run(dataIP);
      const generateNumber = Math.floor(Math.random() * 78) + dater;
      const genCode = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      });
      const admin = await adminAuth.create({
        companyCode: genCode,
        companyname,
        email,
        yourName,
        password: hash,
        walletNumber: generateNumber,
        token: genToken,
        OTP: genOTP,
        expectedClockIn: defaultTime,
        latitude: realData?.latitude,
        longitude: realData?.longitude,
      });

      if (!admin) {
        next(
          new AppError({
            message: "Account not created",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      const createWallet = await adminWalletModel.create({
        _id: admin?._id,
        balance: 15000,

        credit: 0,
        debit: 0,
      });

      admin?.wallet.push(new mongoose.Types.ObjectId(createWallet?._id));

      admin.save();

      if (!createWallet) {
        next(
          new AppError({
            message: "couldn't create admin wallet",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      verifyEmail(admin)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      return res.status(200).json({
        message: "Success",
        data: admin,
        result: realData,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: "an error occurred while creating admin",
        data: error,
        err: error.message,
      });
    }
  }
);

export const getIpAddress = async (req: Request, res: Response) => {
  try {
    let dataIP: any;
  } catch (error) {
    console.log(error);
  }
};

//sign in
export const adminSignin = async (req: Request, res: Response) => {
  try {
    const { email, password, companyname, OTP } = req.body;

    const admin = await adminAuth.findOne({ email });

    if (admin?.companyname! !== companyname) {
      return res.status(400).json({
        message: "please enter the valid company name",
      });
    } else {
      const check = await bcrypt.compare(password, admin?.password!);

      if (check) {
        res.status(201).json({
          message: "welcome",
          data: admin,
        });
      } else {
        console.log("bad");
        return res.status(400).json({
          message: "login failed",
        });
      }
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occurred while logging in admin",
      data: error.message,
    });
  }
};

//get all admins
export const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminAuth.find();

    return res.status(200).json({
      message: "get all admins",
      data: admin,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get admin",
      data: error,
      err: error.message,
    });
  }
};

export const getOneAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminAuth.findById(req.params.adminId).populate([
      {
        path: "wallet",
        select: "balance credit debit",
      },
      {
        path: "viewUser",
      },
      {
        path: "transactionHistory",
      },
      {
        path: "adminLeave",
      },
      {
        path: "mainPayRoll",
      },
      {
        path: "SetAttendance",
      },
      {
        path: "viewStaffHistory",
      },
      {
        path: "viewAbsentStaff",
      },
      {
        path: "staffLeave",
      },

      {
        path: "viewLateStaff",
      },
      {
        path: "viewStaffAttendance",
      },
      {
        path: "PerformanceMilestone",
      },
    ]);

    return res.status(200).json({
      message: "get one admin",
      data: admin,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get one admin",
      data: error,
      err: error.message,
    });
  }
};

//verify account via mail

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const admin = await adminAuth.findById(req.params.adminId);

    if (admin?.OTP !== "") {
      if (admin?.token !== "") {
        await adminAuth.findByIdAndUpdate(
          admin?._id,
          {
            token: "",
            verified: true,
          },
          { new: true }
        );

        return res.status(201).json({
          data: admin,
        });
      } else {
        return res.status(400).json({
          message: "you have inputed a wrong otp",
        });
      }
    } else {
      return res.status(400).json({
        message: "you didn't meet the set credentials",
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "error",
      data: error,
    });
  }
};

//account settings

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const {
      expectedClockIn,
      expectedClockOut,
      companyname,
      email,
      yourName,
      workingDays,
    } = req.body;

    const getAdmin = await adminAuth.findById(req.params.adminId);

    // const getStaffDetails = await staffAuth.findById(req.params.staffId);

    if (getAdmin) {
      const update = await adminAuth.findByIdAndUpdate(
        getAdmin?._id,
        {
          expectedClockIn,
          expectedClockOut,
          companyname,
          email,
          yourName,
          workingDays,
        },
        { new: true }
      );

      return res.status(201).json({
        message: "updated admin details successfully",
        data: update,
      });
    } else {
      return res.status(400).json({
        message: "admin not found",
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "couldn't update admin",
      data: error,
      error: error.message,
    });
  }
};

//make search

export const makeQuery = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const search = await staffAuth.find(req.query).sort({ name: 1 });
    return res.status(200).json({
      message: "gotten",
      data: search,
    });
  } catch (error) {
    return res.status(400).json({
      message: "an error occurred",
      data: error,
    });
  }
};
