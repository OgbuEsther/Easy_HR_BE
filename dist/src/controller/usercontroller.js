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
exports.verifyUser = exports.deactivateStaff = exports.updateStaff = exports.getOneStaff = exports.getAllStaff = exports.staffSignin = exports.staffSignup = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const adminAuth_1 = __importDefault(require("../model/admin/adminAuth"));
const staffAuth_1 = __importDefault(require("../model/staff/staffAuth"));
const StaffWallet_1 = __importDefault(require("../model/staff/staffDashboard/StaffWallet"));
const asyncHandler_1 = require("../utils/asyncHandler");
const appError_1 = require("../utils/appError");
const email_1 = require("../utils/email");
exports.staffSignup = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyname, email, yourName, password, position, walletNumber } = req.body;
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const OTP = crypto_1.default.randomBytes(2).toString("hex");
        const getAdmin = yield adminAuth_1.default.findOne({ companyname });
        if (!getAdmin) {
            next(new appError_1.AppError({
                message: "Not a regsitered Admin yet",
                httpCode: appError_1.HttpCode.BAD_REQUEST,
            }));
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
        const staff = yield staffAuth_1.default.create({
            companyCode: getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.companyCode,
            companyname,
            email,
            yourName,
            password: hash,
            position,
            walletNumber: generateNumber,
            amount: 0,
            token,
            OTP,
        });
        if (!staff) {
            next(new appError_1.AppError({
                message: "couldn't create staff account",
                httpCode: appError_1.HttpCode.BAD_REQUEST,
            }));
        }
        if ((getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.companyname) === (staff === null || staff === void 0 ? void 0 : staff.companyname)) {
            getAdmin.viewUser.push(new mongoose_1.default.Types.ObjectId(staff === null || staff === void 0 ? void 0 : staff._id));
            getAdmin.save();
            const createWallet = yield StaffWallet_1.default.create({
                _id: staff === null || staff === void 0 ? void 0 : staff._id,
                balance: 15000,
                credit: 0,
                debit: 0,
            });
            staff === null || staff === void 0 ? void 0 : staff.wallet.push(new mongoose_1.default.Types.ObjectId(createWallet === null || createWallet === void 0 ? void 0 : createWallet._id));
            staff.save();
            if (!createWallet) {
                next(new appError_1.AppError({
                    message: "couldn't create staff wallet",
                    httpCode: appError_1.HttpCode.BAD_REQUEST,
                }));
            }
            // await emailEnv(staff ,)
            // .then((res) => console.log("this is res", res))
            // .catch((err) => console.log("this is err", err));
            (0, email_1.verifyStaffEmail)(staff);
            (0, email_1.verifyStaffEmailByAdmin)(staff, getAdmin);
            return res.status(200).json({
                status: 200,
                message: "Staff created successfully and mail sent",
                data: staff,
            });
        }
        else {
            return res.status(400).json({
                message: "unable to create staff under this company name",
            });
        }
    }
    catch (error) {
        console.log("error", error);
        return res.status(400).json({
            message: "an error occurred while creating staff",
            data: error.message,
        });
    }
}));
exports.staffSignin = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyname, email, password } = req.body;
        const staff = yield staffAuth_1.default.findOne({ email });
        if ((staff === null || staff === void 0 ? void 0 : staff.companyname) !== companyname) {
            next(new appError_1.AppError({
                message: "wrong request..... you are not under this company ",
                httpCode: appError_1.HttpCode.BAD_REQUEST,
            }));
        }
        else {
            const check = yield bcrypt_1.default.compare(password, staff === null || staff === void 0 ? void 0 : staff.password);
            if (check) {
                res.status(201).json({
                    message: "welcome",
                    data: staff,
                });
            }
            else {
                console.log("bad");
                next(new appError_1.AppError({
                    message: "wrong request",
                    httpCode: appError_1.HttpCode.BAD_REQUEST,
                }));
            }
        }
        return res.status(200).json({
            message: "Success , staff is logged in",
            data: staff,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occurred while logging in staff",
            data: error.message,
        });
    }
}));
//get all admins
const getAllStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield staffAuth_1.default.find();
        return res.status(200).json({
            message: "get all staff",
            data: staff,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to get staff",
            data: error,
            err: error.message,
        });
    }
});
exports.getAllStaff = getAllStaff;
const getOneStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield staffAuth_1.default.findById(req.params.staffId).populate([
            {
                path: "wallet",
            },
            {
                path: "transactionHistory",
            },
            {
                path: "payRoll",
            },
            {
                path: "Attendance",
            },
            {
                path: "mainPayRoll",
            },
            {
                path: "staffLeave",
            },
        ]);
        return res.status(200).json({
            message: "gotten one staff",
            data: staff,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to get staff",
            data: error,
            err: error.message,
        });
    }
});
exports.getOneStaff = getOneStaff;
//update staff details
const updateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        const getStaffDetails = yield staffAuth_1.default.findById(req.params.staffId);
        const update = yield staffAuth_1.default.findByIdAndUpdate(getStaffDetails === null || getStaffDetails === void 0 ? void 0 : getStaffDetails._id, { amount: (getStaffDetails === null || getStaffDetails === void 0 ? void 0 : getStaffDetails.amount) + amount }, { new: true });
        getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.viewUser.push(new mongoose_1.default.Types.ObjectId(update === null || update === void 0 ? void 0 : update._id));
        getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save();
        return res.status(201).json({
            message: "updated staff amount successfully",
            data: update
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "couldn't update staff",
            data: error,
            error: error.message
        });
    }
});
exports.updateStaff = updateStaff;
//deactivate a staff
const deactivateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        yield (getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.viewUser.pull(new mongoose_1.default.Types.ObjectId(getStaff._id)));
        yield (getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save());
        return res.status(200).json({
            message: "deactivated Staff successfully",
            data: getStaff
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "couldn't deactivate staff",
            data: error,
            error: error.message
        });
    }
});
exports.deactivateStaff = deactivateStaff;
//verify account via mail
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, companyname, OTP } = req.body;
        const staff = yield staffAuth_1.default.findById(req.params.staffId);
        if ((staff === null || staff === void 0 ? void 0 : staff.OTP) === OTP) {
            if ((staff === null || staff === void 0 ? void 0 : staff.token) !== "") {
                if ((staff === null || staff === void 0 ? void 0 : staff.companyname) !== companyname) {
                    return res.status(400).json({
                        message: "please enter the valid company name"
                    });
                }
                else {
                    const check = yield bcrypt_1.default.compare(password, staff === null || staff === void 0 ? void 0 : staff.password);
                    if (check) {
                        yield staffAuth_1.default.findByIdAndUpdate(staff === null || staff === void 0 ? void 0 : staff._id, {
                            token: "",
                            verified: true,
                        }, { new: true });
                        return res.status(201).json({
                            message: "Account has been verified, you can now signin",
                            //   data: user,
                        });
                    }
                    else {
                        console.log("bad");
                        return res.status(400).json({
                            message: "verification  failed",
                        });
                    }
                }
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
const verifiedStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield staffAuth_1.default.findById(req.params.staffId);
        const company = yield adminAuth_1.default.findOne({ name: user === null || user === void 0 ? void 0 : user.companyname });
        const codedNumb = crypto_1.default.randomBytes(2).toString("hex");
        if (user) {
            if (user.token !== "") {
                const userData = yield staffAuth_1.default.findByIdAndUpdate(user._id, {
                    staffToken: codedNumb,
                }, { new: true });
                (0, email_1.finalVerifyStaffEmail)(user);
                return res.status(200).json({
                    message: `Admin has recieved your request`,
                    // data: userData,
                });
            }
            else {
                return res.status(404).json({
                    message: `Error`,
                });
            }
        }
        else {
            return res.json({
                message: `Error getting User`,
            });
        }
    }
    catch (err) {
        return res.status(404).json({
            message: err.message,
        });
    }
});
const VerifiedStaffFinally = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { response } = req.body;
        const getUser = yield staffAuth_1.default.findById(req.params.staffId);
        const company = yield adminAuth_1.default.findOne({ name: getUser === null || getUser === void 0 ? void 0 : getUser.companyname });
        if (response === "Yes") {
            if (getUser) {
                yield staffAuth_1.default.findByIdAndUpdate(req.params.id, {
                    token: "",
                    verified: true,
                }, { new: true });
                (0, email_1.finalVerifyAdminEmail)(getUser, company);
                res.status(201).json({ message: "Sent..." });
                res.end();
            }
            else {
                return res.status(404).json({
                    message: "user doesn't exist",
                });
            }
        }
        else if (response === "No") {
            if (getUser) {
                const staff = yield staffAuth_1.default.findById(req.params.id);
                const name = staff === null || staff === void 0 ? void 0 : staff.companyname;
                const company = yield adminAuth_1.default.findOne({ name });
                (_a = company === null || company === void 0 ? void 0 : company.viewUser) === null || _a === void 0 ? void 0 : _a.pull(new mongoose_1.default.Types.ObjectId(staff === null || staff === void 0 ? void 0 : staff._id));
                company === null || company === void 0 ? void 0 : company.save();
                yield staffAuth_1.default.findByIdAndDelete(req.params.id);
                return res.status(201).json({ message: "staff has been deleted" });
            }
        }
        else {
            return res.json({ message: "You can't be accepted" });
        }
        res.end();
    }
    catch (err) {
        return;
    }
});
/**const staffMonthlySalary = [
  {
    name: "Peter",
    salary: 500,
  },
  {
    name: "Okus",
    salary: 1500,
  },
  {
    name: "Vicy",
    salary: 2500,
  },
];

const staff = [
  {
    name: "Peter",
    salary: 5,
  },
  {
    name: "Okus",
    salary: 15,
  },
  {
    name: "Vicy",
    salary: 25,
  },
];


const dataPay = monthlySalary.map((el) => {
  return staff.map((props) => {
    return props.name === el.name
      ? (props.salary = props.salary + el.salary)
      : null;
  });
});

console.log(dataPay.flat().filter((el) => el !== null));
console.log(staff); */ 
