import Joi from "joi";

export const userSchema = {
  register: Joi.object({
    yourName: Joi.string().required(),
    email: Joi.string().email().required(),
    companyname: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    companyname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).alphanum().required(),
  }),
};

