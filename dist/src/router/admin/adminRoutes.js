"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admin_1 = require("../../controller/PayRoll/Admin");
const StaffTime_1 = require("../../controller/Attendance/StaffTime");
const leaves_1 = require("../../controller/Leave/leaves");
const adminPerformance_1 = require("../../controller/Performance/adminPerformance");
const AdminRoutes = (0, express_1.Router)();
// AdminRoutes.post("/paysalary/:adminId", createPayRoll)
AdminRoutes.patch("/createpayroll/:adminId", Admin_1.PayRoll2);
AdminRoutes.post("/calculatepayroll/:adminId", Admin_1.calculatePayRoll);
// AdminRoutes.post("/paysalarywithhouseplan/:adminId", staffWithPlans)
AdminRoutes.post("/fundwallet/:userId/:walletId", Admin_1.fundWalletFromBank);
AdminRoutes.post("/createattendance/:adminId", StaffTime_1.createAttendance);
// AdminRoutes.route("/pay/:adminid").patch(checkPayment);
// AdminRoutes.route("/pay-out/:staffid").post(checkOutToBank);
// AdminRoutes.post("/createpayroll/:staffId" ,createPayRoll )
//LEAVE !!!!!!
//CREATE TYPE OF LEAVE 
AdminRoutes.post("/createleave/:adminId", leaves_1.createLeave);
//createPerformanceMilestone
AdminRoutes.post("/createperformancemilestone/:adminId", adminPerformance_1.createMileStone);
AdminRoutes.post("/createstaffscore", adminPerformance_1.enterStaffScore);
AdminRoutes.patch("/createadminscore/:rateId", adminPerformance_1.enterAdminScore);
exports.default = AdminRoutes;
