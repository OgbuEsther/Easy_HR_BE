"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envVariables = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    LIVE_URI: process.env.LIVE_URI
};
exports.default = envVariables;
