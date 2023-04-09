import { Router } from "express";
import { login, register } from "../controller/usercontroller";
import {
  loginValidation,
  registerValidation,
} from "../middleware/validator/userValidation/userValidation";

const userRoutes = Router();

userRoutes.post("/register", registerValidation, register);
userRoutes.post("/login", loginValidation, login);

export default userRoutes;
