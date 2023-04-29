import { Router } from "express";
// import { HousePlan,FeesPlan,travelPlan } from "../../controller/staff/staffDashboard/createPlans";

import { createAttendance, createClockIn, createClockOut } from "../../controller/Attendance/StaffTime";


const staffRoutes = Router()

// staffRoutes.post("/houseplan/:staffId" , HousePlan)
// staffRoutes.post("/travel/:staffId" , travelPlan)
// staffRoutes.post("/schoolplan/:staffId" , FeesPlan)
staffRoutes.post("/clockin/:staffId/:timeId" , createClockIn)

staffRoutes.post("/clockout/:staffId/:timeId" , createClockOut)

export default staffRoutes
