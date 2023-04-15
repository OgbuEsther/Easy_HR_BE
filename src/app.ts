import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/error";
import { AppError, HttpCode } from "./utils/appError";

import staffAuthRoutes from "./router/staff/staffAuthRoutes";
import adminAuthRoutes from "./router/admin/adminAuth";
import AdminRoutes from "./router/admin/adminRoutes";

const data = {
  name: "Peter",
  matID: 33445,
  color: "red",
};

//creating our application
const appConfig = (app: Application) => {
  //implenting ejs
  app.set("view engine", "ejs");
  app
    .use(express.static("public"))
    .use(express.static(`${__dirname} ./public/css`))
    .use(express.static(`${__dirname} ./public/asset`));
  //
  app.use(express.json()).use(cors()).use(morgan("dev"));

  //routes (API endpoints)
  app.get("/view" , (req:Request , res:Response)=>{
    res.render("index" , {data})
  })
  .get("/", (req: Request, res: Response) => {
    res.json({ message: "api ready for consumption" });
  });
  app.use("/api/staff", staffAuthRoutes);
  app.use("/api/admin", adminAuthRoutes);
  app.use("/api", AdminRoutes);
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
