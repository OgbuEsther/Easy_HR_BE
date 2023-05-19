import { Router } from "express";
// import { HousePlan,FeesPlan,travelPlan } from "../../controller/staff/staffDashboard/createPlans";

import { createAttendance, createClockIn, createClockOut } from "../../controller/Attendance/StaffTime";
import { ApproveOrReject, applyForLeave } from "../../controller/Leave/leaves";


const staffRoutes = Router()

// staffRoutes.post("/houseplan/:staffId" , HousePlan)
// staffRoutes.post("/travel/:staffId" , travelPlan)
// staffRoutes.post("/schoolplan/:staffId" , FeesPlan)
staffRoutes.post("/clockin/:staffId/:adminId" , createClockIn)

staffRoutes.post("/clockout/:staffId/:adminId" , createClockOut)

//LEAVE 
//APPLICATION FOR LEAVE 
staffRoutes.post("/applyforleave/:staffId/:adminId" ,applyForLeave )
staffRoutes.patch("/getapprovedorrejected/:staffLeaveId/:adminId" ,ApproveOrReject )

export default staffRoutes
