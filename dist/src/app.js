"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./middleware/error");
const appError_1 = require("./utils/appError");
const staffAuthRoutes_1 = __importDefault(require("./router/staff/staffAuthRoutes"));
const adminAuth_1 = __importDefault(require("./router/admin/adminAuth"));
const adminRoutes_1 = __importDefault(require("./router/admin/adminRoutes"));
const data = {
    name: "Peter",
    matID: 33445,
    color: "red",
};
//creating our application
const appConfig = (app) => {
    //implenting ejs
    app.set("view engine", "ejs");
    // app
    //   .use(express.static("public"))
    //   .use(express.static(`${__dirname} ./public/css`))
    //   .use(express.static(`${__dirname} ./public/asset`));
    //
    app.use(express_1.default.json()).use((0, cors_1.default)()).use((0, morgan_1.default)("dev"));
    //routes (API endpoints)
    app.get("/view", (req, res) => {
        res.render("index", { data });
    })
        .get("/", (req, res) => {
        res.json({ message: "api ready for consumption" });
    });
    app.use("/api/staff", staffAuthRoutes_1.default);
    app.use("/api/admin", adminAuth_1.default);
    app.use("/api", adminRoutes_1.default);
    // app.use("/api/auth", userRoutes);
    //checking all routes
    app.all("*", (req, res, next) => {
        next(new appError_1.AppError({
            message: `this route does not exist ${req.originalUrl}`,
            httpCode: appError_1.HttpCode.NOT_FOUND,
        }));
    });
    //error handler
    app.use(error_1.errorHandler);
};
exports.default = appConfig;
