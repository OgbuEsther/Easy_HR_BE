import { Request, Response, NextFunction } from "express";
import { AppError, HttpCode } from "../../utils/appError";

//creating the developer's error

export const devErrors = (err: AppError, res: Response) => {
  return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
    error: err,
    status: err.httpCode,
    stack: err.stack,
    // name: AppError.name,
    message: err.message,
  });
};

//creating our error handler
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  devErrors(err, res);
};
