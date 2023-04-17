"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admin_1 = require("../../controller/PayRoll/Admin");
const StaffTime_1 = require("../../controller/Attendance/StaffTime");
const AdminRoutes = (0, express_1.Router)();
AdminRoutes.post("/paysalary/:adminId", Admin_1.createPayRoll);
// AdminRoutes.post("/paysalarywithhouseplan/:adminId", staffWithPlans)
AdminRoutes.post("/fundwallet/:userId/:walletId", Admin_1.fundWalletFromBank);
AdminRoutes.post("/createattendance/:adminId", StaffTime_1.createAttendance);
// AdminRoutes.route("/pay/:adminid").patch(checkPayment);
// AdminRoutes.route("/pay-out/:staffid").post(checkOutToBank);
// AdminRoutes.post("/createpayroll/:staffId" ,createPayRoll )
exports.default = AdminRoutes;
