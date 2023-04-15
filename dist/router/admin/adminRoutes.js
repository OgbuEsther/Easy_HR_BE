"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admin_1 = require("../../controller/PayRoll/Admin");
const AdminRoutes = (0, express_1.Router)();
AdminRoutes.post("/paysalary/:UserId", Admin_1.MakeTransfer);
// AdminRoutes.post("/paysalarywithhouseplan/:adminId", staffWithPlans)
AdminRoutes.post("/fundwallet/:userId/:walletId", Admin_1.fundWalletFromBank);
// AdminRoutes.route("/pay/:adminid").patch(checkPayment);
// AdminRoutes.route("/pay-out/:staffid").post(checkOutToBank);
AdminRoutes.post("/createpayroll/:staffId", Admin_1.createPayRoll);
exports.default = AdminRoutes;