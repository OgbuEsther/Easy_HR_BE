import { RequestHandler } from "express";
import { validator } from "../validator";
import { userSchema } from "./userSchema";

export const registerValidation: RequestHandler = (req, res, next) => {
  validator(userSchema.register, req.body, next);
};

export const loginValidation: RequestHandler = (req, res, next) => {
  validator(userSchema.login, req.body, next);
};
