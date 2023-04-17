"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { HousePlan,FeesPlan,travelPlan } from "../../controller/staff/staffDashboard/createPlans";
const StaffTime_1 = require("../../controller/Attendance/StaffTime");
const staffRoutes = (0, express_1.Router)();
// staffRoutes.post("/houseplan/:staffId" , HousePlan)
// staffRoutes.post("/travel/:staffId" , travelPlan)
// staffRoutes.post("/schoolplan/:staffId" , FeesPlan)
staffRoutes.post("/clockin/:staffId/:timeId", StaffTime_1.createClockIn);
staffRoutes.post("/clockout/:staffId/:timeId", StaffTime_1.createClockOut);
exports.default = staffRoutes;
