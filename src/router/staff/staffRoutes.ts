import { Router } from "express";
// import { HousePlan,FeesPlan,travelPlan } from "../../controller/staff/staffDashboard/createPlans";

import { createClockIn, createClockOut } from "../../controller/Attendance/StaffTime";


const staffRoutes = Router()

// staffRoutes.post("/houseplan/:staffId" , HousePlan)
// staffRoutes.post("/travel/:staffId" , travelPlan)
// staffRoutes.post("/schoolplan/:staffId" , FeesPlan)
staffRoutes.post("/clockin/:staffId" , createClockIn)
staffRoutes.post("/clockout/:staffId" , createClockOut)

export default staffRoutes