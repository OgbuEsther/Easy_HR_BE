"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../../controller/adminController");
const userValidation_1 = require("../../middleware/validator/userValidation/userValidation");
const adminAuthRoutes = (0, express_1.Router)();
adminAuthRoutes.post("/login", userValidation_1.loginValidation, adminController_1.adminSignin);
adminAuthRoutes.post("/register", userValidation_1.registerValidation, adminController_1.adminSignup);
// adminAuthRoutes.get("/", getAllAdmin);
// adminAuthRoutes.get("/:adminId", getOneAdmin);
exports.default = adminAuthRoutes;