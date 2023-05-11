import { Router } from "express";
import { adminSignin, adminSignup, getAllAdmin, getOneAdmin, updateAdmin, verifyUser } from "../../controller/adminController";
import { loginValidation, registerValidation } from "../../middleware/validator/userValidation/userValidation";

const adminAuthRoutes = Router();

adminAuthRoutes.post("/login", loginValidation ,  adminSignin);
adminAuthRoutes.post("/register",registerValidation, adminSignup);
adminAuthRoutes.get("/", getAllAdmin);
adminAuthRoutes.get("/:adminId", getOneAdmin);
adminAuthRoutes.get("/:adminId/verify", verifyUser);
adminAuthRoutes.get("/:adminId/updateadmin", updateAdmin);
export default adminAuthRoutes;

