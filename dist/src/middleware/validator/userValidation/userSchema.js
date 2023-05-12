"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = {
    register: joi_1.default.object({
        yourName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        companyname: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
    login: joi_1.default.object({
        companyname: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    }),
};
