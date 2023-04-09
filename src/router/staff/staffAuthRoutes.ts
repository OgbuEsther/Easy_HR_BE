import { Router } from "express";
import { staffRegister } from "../../controller/usercontroller";
// import {
//   deactivateStaff,
//   getAllStaff,
//   getOneStaff,
//   staffSignin,
//   staffSignup,
//   updateStaff,
// } from "../../controller/staff/staffAuthController";

const staffAuthRoutes = Router();

// staffAuthRoutes.post("/stafflogin", staffSignin);
staffAuthRoutes.post("/staffregister", staffRegister);
// staffAuthRoutes.get("/allstaff/", getAllStaff);
// staffAuthRoutes.get("/staff/:staffId", getOneStaff);
// staffAuthRoutes.patch("/updateStaff/:staffId", updateStaff);
// staffAuthRoutes.delete("/deactivateStaff/:staffId/:adminId", deactivateStaff);


export default staffAuthRoutes;
