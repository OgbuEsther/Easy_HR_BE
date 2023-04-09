import { Request, Response, NextFunction } from "express";
import { Iuser } from "../interfaces/userInterface";
import userModel from "../model/userModel";
import { AppError, HttpCode } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(
  async (req: Request<{}, {}, Iuser>, res: Response, next: NextFunction) => {
    const { email, name, password, confirmpassword } = req.body;

    const user = await userModel.create({
      email,
      name,
      password,
      confirmpassword,
    });
    if (!user) {
      next(
        new AppError({
          message: "Account not created",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    }

    return res.status(HttpCode.CREATED).json({
      message: "Success",
      data: user,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email)
      next(
        new AppError({
          message: "Email is required",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );

    const user = await userModel.findOne({ email });
    if (!user)
      next(
        new AppError({
          message: "Account does not match",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );

    user?.comparePassword(password);

    return res.status(HttpCode.OK).json({
      message: "Success",
      data: user,
    });
  }
);
