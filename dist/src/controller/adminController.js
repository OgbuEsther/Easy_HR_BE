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
exports.makeQuery = exports.updateAdmin = exports.verifyUser = exports.getOneAdmin = exports.getAllAdmin = exports.adminSignin = exports.getIpAddress = exports.adminSignup = void 0;
const adminAuth_1 = __importDefault(require("../model/admin/adminAuth"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const adminWallets_1 = __importDefault(require("../model/admin/admindashboard/adminWallets"));
const appError_1 = require("../utils/appError");
const asyncHandler_1 = require("../utils/asyncHandler");
const crypto_1 = __importDefault(require("crypto"));
const staffAuth_1 = __importDefault(require("../model/staff/staffAuth"));
const email_1 = require("../utils/email");
const axios_1 = __importDefault(require("axios"));
const one_sdk_1 = require("@superfaceai/one-sdk");
const app = (0, express_1.default)();
app.set("trust proxy", true);
const sdk = new one_sdk_1.SuperfaceClient();
function run(ip) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load the profile
        const profile = yield sdk.getProfile("address/ip-geolocation@1.0.1");
        // Use the profile
        const result = yield profile.getUseCase("IpGeolocation").perform({
            //   ipAddress: "102.88.34.40",
            ipAddress: ip,
        }, {
            provider: "ipdata",
            security: {
                apikey: {
                    apikey: "41b7b0ed377c175c4b32091abd68d049f5b6b748b2bee4789a161d93",
                },
            },
        });
        // Handle the result
        try {
            const data = result.unwrap();
            return data;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.adminSignup = (0, asyncHandler_1.asyncHandler)((req, res, next, ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use the profile
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
        const defaultTime = "07:30:00 PM";
        let dataIP;
        yield axios_1.default.get("https://api.ipify.org/").then((res) => {
            dataIP = res.data;
        });
        let realData = yield run(dataIP);
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
            expectedClockIn: defaultTime,
            latitude: realData === null || realData === void 0 ? void 0 : realData.latitude,
            longitude: realData === null || realData === void 0 ? void 0 : realData.longitude,
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
        (0, email_1.verifyEmail)(admin)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        return res.status(200).json({
            message: "Success",
            data: admin,
            result: realData,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occurred while creating admin",
            data: error,
            err: error.message,
        });
    }
}));
const getIpAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dataIP;
    }
    catch (error) {
        console.log(error);
    }
});
exports.getIpAddress = getIpAddress;
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
            {
                path: "mainPayRoll",
            },
            {
                path: "SetAttendance",
            },
            {
                path: "viewStaffHistory",
            },
            {
                path: "viewAbsentStaff",
            },
            {
                path: "staffLeave",
            },
            {
                path: "viewLateStaff",
            },
            {
                path: "viewStaffAttendance",
            },
            {
                path: "PerformanceMilestone",
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
//account settings
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { expectedClockIn, expectedClockOut, companyname, email, yourName, workingDays, } = req.body;
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        // const getStaffDetails = await staffAuth.findById(req.params.staffId);
        if (getAdmin) {
            const update = yield adminAuth_1.default.findByIdAndUpdate(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin._id, {
                expectedClockIn,
                expectedClockOut,
                companyname,
                email,
                yourName,
                workingDays,
            }, { new: true });
            return res.status(201).json({
                message: "updated admin details successfully",
                data: update,
            });
        }
        else {
            return res.status(400).json({
                message: "admin not found",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "couldn't update admin",
            data: error,
            error: error.message,
        });
    }
});
exports.updateAdmin = updateAdmin;
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
