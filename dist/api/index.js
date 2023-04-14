"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeRoutes_1 = __importDefault(require("../routes/homeRoutes"));
const authroutes_1 = __importDefault(require("../routes/authroutes"));
const router = (0, express_1.Router)();
router.use("/", homeRoutes_1.default);
router.use("/auth", authroutes_1.default);
exports.default = router;
