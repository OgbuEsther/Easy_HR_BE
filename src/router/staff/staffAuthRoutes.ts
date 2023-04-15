import { Router } from "express";
import { deactivateStaff, getAllStaff, getOneStaff, staffSignin, staffSignup, updateStaff } from "../../controller/usercontroller";
import { loginValidation, registerValidation } from "../../middleware/validator/userValidation/userValidation";

const staffAuthRoutes = Router();

staffAuthRoutes.post("/stafflogin", loginValidation ,  staffSignin);
staffAuthRoutes.post("/staffregister", registerValidation, staffSignup);
staffAuthRoutes.get("/allstaff/", getAllStaff);
staffAuthRoutes.get("/staff/:staffId", getOneStaff);
staffAuthRoutes.patch("/updateStaff/:staffId", updateStaff);
staffAuthRoutes.delete("/deactivateStaff/:staffId/:adminId", deactivateStaff);


export default staffAuthRoutes;
