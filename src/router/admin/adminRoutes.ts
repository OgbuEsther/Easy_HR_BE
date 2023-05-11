import {Router} from "express"

import { calculatePayRoll, createPayRoll , fundWalletFromBank, MakeTransfer, PayRoll2 } from "../../controller/PayRoll/Admin"
import { createAttendance } from "../../controller/Attendance/StaffTime"
import { createLeave } from "../../controller/Leave/leaves"
import { createMileStone, enterAdminScore, enterStaffScore, PerformanceMilestone } from "../../controller/Performance/adminPerformance"

const AdminRoutes = Router()

// AdminRoutes.post("/paysalary/:adminId", createPayRoll)
AdminRoutes.patch("/createpayroll/:adminId", PayRoll2)
AdminRoutes.post("/calculatepayroll/:adminId", calculatePayRoll)
// AdminRoutes.post("/paysalarywithhouseplan/:adminId", staffWithPlans)
AdminRoutes.post("/fundwallet/:userId/:walletId",fundWalletFromBank )
AdminRoutes.post("/createattendance/:adminId" , createAttendance)
// AdminRoutes.route("/pay/:adminid").patch(checkPayment);
// AdminRoutes.route("/pay-out/:staffid").post(checkOutToBank);
// AdminRoutes.post("/createpayroll/:staffId" ,createPayRoll )


//LEAVE !!!!!!
//CREATE TYPE OF LEAVE 
AdminRoutes.post("/createleave/:adminId" ,createLeave )


//createPerformanceMilestone

AdminRoutes.post("/createperformancemilestone/:adminId" ,createMileStone )
AdminRoutes.post("/createstaffscore/:MileStoneId" ,enterStaffScore )
AdminRoutes.patch("/createadminscore/:rateId" ,enterAdminScore )

export default AdminRoutes
