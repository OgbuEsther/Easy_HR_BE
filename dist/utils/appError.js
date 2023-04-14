"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.HttpCode = void 0;
var HttpCode;
(function (HttpCode) {
    HttpCode[HttpCode["OK"] = 200] = "OK";
    HttpCode[HttpCode["CREATED"] = 201] = "CREATED";
    HttpCode[HttpCode["ACCEPTED"] = 202] = "ACCEPTED";
    HttpCode[HttpCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpCode[HttpCode["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    HttpCode[HttpCode["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    HttpCode[HttpCode["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    HttpCode[HttpCode["FOUND"] = 302] = "FOUND";
    HttpCode[HttpCode["SEE_OTHER"] = 303] = "SEE_OTHER";
    HttpCode[HttpCode["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HttpCode[HttpCode["ACCEPTED_REST"] = 305] = "ACCEPTED_REST";
    HttpCode[HttpCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpCode[HttpCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpCode[HttpCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpCode[HttpCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpCode[HttpCode["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpCode[HttpCode["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    HttpCode[HttpCode["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    HttpCode[HttpCode["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    HttpCode[HttpCode["CONFLICT"] = 409] = "CONFLICT";
    HttpCode[HttpCode["GONE"] = 410] = "GONE";
    HttpCode[HttpCode["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    HttpCode[HttpCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpCode[HttpCode["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpCode[HttpCode["SERVICE_UNAVAILBLE"] = 503] = "SERVICE_UNAVAILBLE";
    HttpCode[HttpCode["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HttpCode[HttpCode["NETWORK_TIMEOUT"] = 599] = "NETWORK_TIMEOUT";
})(HttpCode = exports.HttpCode || (exports.HttpCode = {}));
class AppError extends Error {
    constructor(args) {
        super(args.message);
        this.isOperational = true;
        Object.setPrototypeOf(this, new.target.prototype);
        this.httpCode = args.httpCode;
        this.name = args.name || "Error";
        if (args.isOperational !== undefined) {
            this.isOperational = args.isOperational;
        }
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
