import adminAuth from "../model/admin/adminAuth";
import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import otpgenerator from "otp-generator";
import adminWalletModel from "../model/admin/admindashboard/adminWallets";
import { AppError, HttpCode } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import crypto from "crypto";
import staffAuth from "../model/staff/staffAuth";

export const adminSignup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
      if (companyname) {
        return res.status(400).json({
          message: "a company with this name already",
        });
      }
      if (!email || !yourName) {
        return res.status(400).json({
          message: "please fill in the required fields",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const dater = Date.now();

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

      return res.status(200).json({
        message: "Success",
        data: admin,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: "an error occurred while creating admin",
        data: error.message,
      });
    }
  }
);

//sign in
export const adminSignin = async (req: Request, res: Response) => {
  try {
    const { email, password, companyname , OTP } = req.body;

    const admin = await adminAuth.findOne({ email });

    if (admin?.companyname! !== companyname) {
      return res.status(400).json({
        message : "please enter the valid company name"
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

// export const verifyUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password, companyname , OTP } = req.body;

//     const admin = await adminAuth.findById(req.params.adminId);

//     if (admin?.OTP === OTP) {
//       if (admin?.token !== "") {
//         if(admin?.companyname! !== companyname){
//           return res.status(400).json({
//             message : "please enter the valid company name"
//           });
        
//         }else{
//           const check = await bcrypt.compare(password, admin?.password!);
//           if (check) {

//             await adminAuth.findByIdAndUpdate(
//               admin?._id,
//               {
//                 token: "",
//                 verified: true,
//               },
//               { new: true }
//             );
    
//             return res.status(201).json({
//               message: "Account has been verified, you can now signin",
//               //   data: user,
//             });
//             res.status(201).json({
//               message: "welcome",
//               data: admin,
//             });


//           } else {
//             console.log("bad");
//             return res.status(400).json({
//               message: "verification  failed",
//             });
//           }
//         }
        
      
//       } else {
//         return res.status(400).json({
//           message: "you have inputed a wrong otp",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         message: "you didn't meet the set credentials",
//       });
//     }
//   } catch (error) {
//     return res.status(404).json({
//       message: "error",
//       data: error,
//     });
//   }
// };

//make search

export const makeQuery = async (req: Request, res: Response): Promise<Response> => {
  try {
    const search = await staffAuth.find(req.query).sort({name:1});
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