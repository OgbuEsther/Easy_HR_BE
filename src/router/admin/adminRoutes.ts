import {Router} from "express"

import { createPayRoll , fundWalletFromBank, MakeTransfer } from "../../controller/PayRoll/Admin"
import { createAttendance } from "../../controller/Attendance/StaffTime"

const AdminRoutes = Router()

AdminRoutes.post("/paysalary/:adminId", createPayRoll)
// AdminRoutes.post("/paysalarywithhouseplan/:adminId", staffWithPlans)
AdminRoutes.post("/fundwallet/:userId/:walletId",fundWalletFromBank )
AdminRoutes.post("/createattendance/:adminId" , createAttendance)
// AdminRoutes.route("/pay/:adminid").patch(checkPayment);
// AdminRoutes.route("/pay-out/:staffid").post(checkOutToBank);
// AdminRoutes.post("/createpayroll/:staffId" ,createPayRoll )

export default AdminRoutes
