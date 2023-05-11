"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { HousePlan,FeesPlan,travelPlan } from "../../controller/staff/staffDashboard/createPlans";
const StaffTime_1 = require("../../controller/Attendance/StaffTime");
const leaves_1 = require("../../controller/Leave/leaves");
const staffRoutes = (0, express_1.Router)();
// staffRoutes.post("/houseplan/:staffId" , HousePlan)
// staffRoutes.post("/travel/:staffId" , travelPlan)
// staffRoutes.post("/schoolplan/:staffId" , FeesPlan)
staffRoutes.post("/clockin/:staffId/:adminId", StaffTime_1.createClockIn);
staffRoutes.post("/clockout/:staffId/:adminId", StaffTime_1.createClockOut);
//LEAVE 
//APPLICATION FOR LEAVE 
staffRoutes.post("/applyforleave/:staffId/:adminId", leaves_1.applyForLeave);
exports.default = staffRoutes;
