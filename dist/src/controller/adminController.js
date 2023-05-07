"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeQuery = exports.verifyUser = exports.getOneAdmin = exports.getAllAdmin = exports.adminSignin = exports.adminSignup = void 0;
const adminAuth_1 = __importDefault(require("../model/admin/adminAuth"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const adminWallets_1 = __importDefault(require("../model/admin/admindashboard/adminWallets"));
const appError_1 = require("../utils/appError");
const asyncHandler_1 = require("../utils/asyncHandler");
const crypto_1 = __importDefault(require("crypto"));
const staffAuth_1 = __importDefault(require("../model/staff/staffAuth"));
const email_1 = require("../utils/email");
exports.adminSignup = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyname, email, yourName, password, walletNumber, token, OTP, } = req.body;
        const genToken = crypto_1.default.randomBytes(32).toString("hex");
        const genOTP = crypto_1.default.randomBytes(2).toString("hex");
        if (!email || !yourName || !password) {
            return res.status(400).json({
                message: "please fill in the required fields",
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const dater = Date.now();
        const generateNumber = Math.floor(Math.random() * 78) + dater;
        const genCode = otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false,
        });
        const admin = yield adminAuth_1.default.create({
            companyCode: genCode,
            companyname,
            email,
            yourName,
            password: hash,
            walletNumber: generateNumber,
            token: genToken,
            OTP: genOTP,
        });
        if (!admin) {
            next(new appError_1.AppError({
                message: "Account not created",
                httpCode: appError_1.HttpCode.BAD_REQUEST,
            }));
        }
        const createWallet = yield adminWallets_1.default.create({
            _id: admin === null || admin === void 0 ? void 0 : admin._id,
            balance: 15000,
            credit: 0,
            debit: 0,
        });
        admin === null || admin === void 0 ? void 0 : admin.wallet.push(new mongoose_1.default.Types.ObjectId(createWallet === null || createWallet === void 0 ? void 0 : createWallet._id));
        admin.save();
        if (!createWallet) {
            next(new appError_1.AppError({
                message: "couldn't create admin wallet",
                httpCode: appError_1.HttpCode.BAD_REQUEST,
            }));
        }
        (0, email_1.verifyEmail)(admin);
        return res.status(200).json({
            message: "Success",
            data: admin,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occurred while creating admin",
            data: error.message,
        });
    }
}));
//sign in
const adminSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, companyname, OTP } = req.body;
        const admin = yield adminAuth_1.default.findOne({ email });
        if ((admin === null || admin === void 0 ? void 0 : admin.companyname) !== companyname) {
            return res.status(400).json({
                message: "please enter the valid company name",
            });
        }
        else {
            const check = yield bcrypt_1.default.compare(password, admin === null || admin === void 0 ? void 0 : admin.password);
            if (check) {
                res.status(201).json({
                    message: "welcome",
                    data: admin,
                });
            }
            else {
                console.log("bad");
                return res.status(400).json({
                    message: "login failed",
                });
            }
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occurred while logging in admin",
            data: error.message,
        });
    }
});
exports.adminSignin = adminSignin;
//get all admins
const getAllAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminAuth_1.default.find();
        return res.status(200).json({
            message: "get all admins",
            data: admin,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to get admin",
            data: error,
            err: error.message,
        });
    }
});
exports.getAllAdmin = getAllAdmin;
const getOneAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminAuth_1.default.findById(req.params.adminId).populate([
            {
                path: "wallet",
                select: "balance credit debit",
            },
            {
                path: "viewUser",
            },
            {
                path: "transactionHistory",
            },
            {
                path: "adminLeave",
            },
        ]);
        return res.status(200).json({
            message: "get one admin",
            data: admin,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to get one admin",
            data: error,
            err: error.message,
        });
    }
});
exports.getOneAdmin = getOneAdmin;
//verify account via mail
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminAuth_1.default.findById(req.params.adminId);
        if ((admin === null || admin === void 0 ? void 0 : admin.OTP) !== "") {
            if ((admin === null || admin === void 0 ? void 0 : admin.token) !== "") {
                yield adminAuth_1.default.findByIdAndUpdate(admin === null || admin === void 0 ? void 0 : admin._id, {
                    token: "",
                    verified: true,
                }, { new: true });
                return res.status(201).json({
                    data: admin,
                });
            }
            else {
                return res.status(400).json({
                    message: "you have inputed a wrong otp",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "you didn't meet the set credentials",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error,
        });
    }
});
exports.verifyUser = verifyUser;
//make search
const makeQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = yield staffAuth_1.default.find(req.query).sort({ name: 1 });
        return res.status(200).json({
            message: "gotten",
            data: search,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occurred",
            data: error,
        });
    }
});
exports.makeQuery = makeQuery;
