import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/error";
import { AppError, HttpCode } from "./utils/appError";
import router from "./api";
import userRoutes from "./routes/authroutes";

//creating our application
const appConfig = (app: Application) => {
  app.use(express.json()).use(cors()).use(morgan("dev"));

  //routes (API endpoints)
  app.use("/api", router);
  // app.use("/api/auth", userRoutes);

  //checking all routes
  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(
      new AppError({
        message: `this route does not exist ${req.originalUrl}`,
        httpCode: HttpCode.NOT_FOUND,
      })
    );
  });

  //error handler
  app.use(errorHandler);
};

export default appConfig;
