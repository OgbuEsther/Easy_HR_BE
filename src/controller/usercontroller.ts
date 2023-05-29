import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import crypto from "crypto";
import otpgenerator from "otp-generator";

import adminAuth from "../model/admin/adminAuth";
import staffAuth from "../model/staff/staffAuth";
import staffWalletModel from "../model/staff/staffDashboard/StaffWallet";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError, HttpCode } from "../utils/appError";
import {
  finalVerifyAdminEmail,
  finalVerifyStaffEmail,
  verifyStaffEmail,
  verifyStaffEmailByAdmin,
} from "../utils/email";

export const staffSignup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyname, email, yourName, password, position, walletNumber } =
        req.body;

      const token = crypto.randomBytes(32).toString("hex");
      const OTP:number = parseInt(otpgenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      })
)
      const getAdmin = await adminAuth.findOne({ companyname });

      if (!getAdmin) {
        next(
          new AppError({
            message: "Not a regsitered Admin yet",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
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

      const staff = await staffAuth.create({
        companyCode: getAdmin?.companyCode,
        companyname,
        email,
        yourName,
        password: hash,
        position,
        walletNumber: generateNumber,
        amount: 0,
        token,
        OTP,
        staffToken: "",
      });

      if (!staff) {
        next(
          new AppError({
            message: "couldn't create staff account",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      if (getAdmin?.companyname === staff?.companyname) {
        getAdmin.viewAbsentStaff.push(new mongoose.Types.ObjectId(staff?._id));

        getAdmin.viewUser.push(new mongoose.Types.ObjectId(staff?._id));
        getAdmin.save();

        const createWallet = await staffWalletModel.create({
          _id: staff?._id,
          balance: 15000,
          credit: 0,
          debit: 0,
        });

        staff?.wallet.push(new mongoose.Types.ObjectId(createWallet?._id));

        staff.save();

        if (!createWallet) {
          next(
            new AppError({
              message: "couldn't create staff wallet",
              httpCode: HttpCode.BAD_REQUEST,
            })
          );
        }
        // await emailEnv(staff ,)
        // .then((res) => console.log("this is res", res))
        // .catch((err) => console.log("this is err", err));

        verifyStaffEmail(staff);
        verifyStaffEmailByAdmin(staff, getAdmin);

        return res.status(200).json({
          status: 200,
          message: "Staff created successfully and mail sent",
          data: staff,
        });
      } else {
        return res.status(400).json({
          message: "unable to create staff under this company name",
        });
      }
    } catch (error: any) {
      console.log("error", error);

      return res.status(400).json({
        message: "an error occurred while creating staff",
        data: error.message,
      });
    }
  }
);

export const staffSignin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyname, email, password } = req.body;

      const staff = await staffAuth.findOne({ email });

      if (staff?.companyname! !== companyname) {
        next(
          new AppError({
            message: "wrong request..... you are not under this company ",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      } else {
        const check = await bcrypt.compare(password, staff?.password!);

        if (check) {
          res.status(201).json({
            message: "welcome",
            data: staff,
          });
        } else {
          console.log("bad");
          next(
            new AppError({
              message: "wrong request",
              httpCode: HttpCode.BAD_REQUEST,
            })
          );
        }
      }

      return res.status(200).json({
        message: "Success , staff is logged in",
        data: staff,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: "an error occurred while logging in staff",
        data: error.message,
      });
    }
  }
);

//get all admins
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffAuth.find();

    return res.status(200).json({
      message: "get all staff",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get staff",
      data: error,
      err: error.message,
    });
  }
};

export const getOneStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffAuth.findById(req.params.staffId).populate([
      {
        path: "wallet",
      },
      {
        path: "transactionHistory",
      },
      {
        path: "Attendance",
      },
      {
        path: "mainPayRoll",
      },
      {
        path: "staffLeave",
      },
    ]);

    return res.status(200).json({
      message: "gotten one staff",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get staff",
      data: error,
      err: error.message,
    });
  }
};

//update staff details

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    const getAdmin = await adminAuth.findById(req.params.adminId);

    const getStaffDetails = await staffAuth.findById(req.params.staffId);

    const update = await staffAuth.findByIdAndUpdate(
      getStaffDetails?._id,
      { amount: getStaffDetails?.amount + amount },
      { new: true }
    );

    getAdmin?.viewUser.push(new mongoose.Types.ObjectId(update?._id));
    getAdmin?.save();

    return res.status(201).json({
      message: "updated staff amount successfully",
      data: update,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "couldn't update staff",
      data: error,
      error: error.message,
    });
  }
};

//deactivate a staff
export const deactivateStaff = async (req: Request, res: Response) => {
  try {
    const getStaff = await staffAuth.findById(req.params.staffId);

    const getAdmin = await adminAuth.findById(req.params.adminId);

    await getAdmin?.viewUser.pull(new mongoose.Types.ObjectId(getStaff!._id));
    await getAdmin?.save();

    return res.status(200).json({
      message: "deactivated Staff successfully",
      data: getStaff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "couldn't deactivate staff",
      data: error,
      error: error.message,
    });
  }
};

//verify account via mail

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const staff = await staffAuth.findById(req.params.staffId);

    if (staff?.OTP !== "") {
      if (staff?.token !== "") {
        await staffAuth.findByIdAndUpdate(
          staff?._id,
          {
            token: "",
            verified: true,
          },
          { new: true }
        );

        return res.status(201).json({
          data: staff,
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

export const verifiedStaff = async (req: Request, res: Response) => {
  try {
    const user = await staffAuth.findById(req.params.staffId);
    console.log(`this is user OTP ${user?.OTP}`);

    // const {} = req.body

    const company = await adminAuth.findOne({ name: user?.companyname! });
    const codedNumb = crypto.randomBytes(2).toString("hex");
    if (user) {
      if (user.token !== "") {
        const userData = await staffAuth.findByIdAndUpdate(
          user._id,
          {
            staffToken: codedNumb,
          },
          { new: true }
        );

        finalVerifyStaffEmail(user);

        return res.status(200).json({
          message: `Admin has recieved your request`,
          // data: userData,
        });
      } else {
        return res.status(404).json({
          message: `Error`,
        });
      }
    } else {
      return res.json({
        message: `Error getting User`,
      });
    }
  } catch (err: any) {
    return res.status(404).json({
      message: err.message,
    });
  }
};

export const VerifiedStaffFinally = async (req: Request, res: Response) => {
  try {
    const { response } = req.body;

    const getUser = await staffAuth.findById(req.params.staffId);
    const company = await adminAuth.findOne({ name: getUser?.companyname! });

    if (response === "Yes") {
      if (getUser) {
        await staffAuth.findByIdAndUpdate(
          req.params.id,
          {
            token: "",

            verified: true,
          },
          { new: true }
        );

        finalVerifyAdminEmail(getUser, company);

        finalVerifyStaffEmail(getUser);

        res.status(201).json({ message: "Sent..." });
        res.end();
      } else {
        return res.status(404).json({
          message: "user doesn't exist",
        });
      }
    } else if (response === "No") {
      if (getUser) {
        const staff = await staffAuth.findById(req.params.staffId);

        const name = staff?.companyname;
        const company = await adminAuth.findOne({ name });

        company?.viewUser?.pull(new mongoose.Types.ObjectId(staff?._id));
        company?.save();

        await staffAuth.findByIdAndDelete(req.params.staffId);
        return res.status(201).json({ message: "staff has been deleted" });
      }
    } else {
      return res.json({ message: "You can't be accepted" });
    }

    res.end();
  } catch (err) {
    return;
  }
};

export const StaffOTPCheck = async (req: Request, res: Response) => {
  try {
    const { OTP } = req.body;

    const getStaff = await staffAuth.findById(req.params.staffId);
    if (getStaff) {
      if (getStaff?.OTP === OTP) {
        return res.status(200).json({
          message: "Right Credentails , You can now sign in",
          data: OTP,
          check: getStaff?.OTP,
        });
      } else {
        return res.status(400).json({
          message: "Wrong Credentials!!!!",
          data : getStaff?.OTP,
          check : OTP
        });
      }
    } else {
      return res.status(400).json({
        message: "couldn't find staff",
        // data : getStaff?.OTP!
      });
    }
  } catch (error: any) {
    return res.json({
      message: "an error occurred while entering OTP",
      data: error,
      err: error?.message,
    });
  }
};

/**const staffMonthlySalary = [
  {
    name: "Peter",
    salary: 500,
  },
  {
    name: "Okus",
    salary: 1500,
  },
  {
    name: "Vicy",
    salary: 2500,
  },
];

const staff = [
  {
    name: "Peter",
    salary: 5,
  },
  {
    name: "Okus",
    salary: 15,
  },
  {
    name: "Vicy",
    salary: 25,
  },
];


const dataPay = monthlySalary.map((el) => {
  return staff.map((props) => {
    return props.name === el.name
      ? (props.salary = props.salary + el.salary)
      : null;
  });
});

console.log(dataPay.flat().filter((el) => el !== null));
console.log(staff); */
