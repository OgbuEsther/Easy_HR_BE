"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const validator_1 = require("../validator");
const userSchema_1 = require("./userSchema");
const registerValidation = (req, res, next) => {
    (0, validator_1.validator)(userSchema_1.userSchema.register, req.body, next);
};
exports.registerValidation = registerValidation;
const loginValidation = (req, res, next) => {
    (0, validator_1.validator)(userSchema_1.userSchema.login, req.body, next);
};
exports.loginValidation = loginValidation;
