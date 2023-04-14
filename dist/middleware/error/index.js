"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.devErrors = void 0;
const appError_1 = require("../../utils/appError");
//creating the developer's error
const devErrors = (err, res) => {
    return res.status(appError_1.HttpCode.INTERNAL_SERVER_ERROR).json({
        error: err,
        status: err.httpCode,
        stack: err.stack,
        // name: AppError.name,
        message: err.message,
    });
};
exports.devErrors = devErrors;
//creating our error handler
const errorHandler = (err, req, res, next) => {
    (0, exports.devErrors)(err, res);
};
exports.errorHandler = errorHandler;
