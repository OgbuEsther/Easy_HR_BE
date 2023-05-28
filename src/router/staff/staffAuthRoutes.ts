import { Router } from "express";
import { deactivateStaff, getAllStaff, getOneStaff, staffSignin, staffSignup, updateStaff, verifyUser ,verifiedStaff ,VerifiedStaffFinally } from "../../controller/usercontroller";
import { loginValidation, registerValidation } from "../../middleware/validator/userValidation/userValidation";
import { makeQuery } from "../../controller/adminController";

const staffAuthRoutes = Router();

staffAuthRoutes.post("/stafflogin", loginValidation ,  staffSignin);
staffAuthRoutes.post("/staffregister", registerValidation, staffSignup);
staffAuthRoutes.get("/allstaff", getAllStaff);
staffAuthRoutes.get("/staff/:staffId", getOneStaff);
staffAuthRoutes.patch("/updateStaff/:staffId", updateStaff);
staffAuthRoutes.delete("/deactivateStaff/:staffId/:adminId", deactivateStaff);
staffAuthRoutes.get("/:staffId/verification" , verifiedStaff)
staffAuthRoutes.get("/:staffId/verifymyaccount" , verifyUser)
staffAuthRoutes.post("/:staffId/verifystaff" , VerifiedStaffFinally)
staffAuthRoutes.get("/search" , makeQuery)


export default staffAuthRoutes;

