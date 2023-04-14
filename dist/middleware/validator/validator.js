"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const appError_1 = require("../../utils/appError");
const validator = (schemaName, body, next) => {
    const value = schemaName.validate(body, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true,
    });
    try {
        value.error
            ? next(new appError_1.AppError({
                httpCode: appError_1.HttpCode.UNAUTHORIZED,
                message: value.error.details[0].message,
            }))
            : next();
    }
    catch (error) {
        next(new appError_1.AppError({
            httpCode: appError_1.HttpCode.UNAUTHORIZED,
            message: error,
        }));
    }
};
exports.validator = validator;
