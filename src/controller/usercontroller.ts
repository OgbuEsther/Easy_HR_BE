import { Request, Response, NextFunction } from "express";

import staffAuth from "../model/staff/staffAuth";

import { AppError, HttpCode } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, yourName, password, companyname , position } = req.body;

    const user = await staffAuth.create({
      email,
      yourName,
      password,
      companyname,
      position
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

    const user = await staffAuth.findOne({ email });
    if (!user)
      next(
        new AppError({
          message: "Account does not match",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );



    return res.status(HttpCode.OK).json({
      message: "Success",
      data: user,
    });
  }
);
