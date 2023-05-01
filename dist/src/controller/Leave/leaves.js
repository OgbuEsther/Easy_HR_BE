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
exports.applyForLeave = exports.createLeave = void 0;
const staffLeave_1 = __importDefault(require("../../model/staff/staffLeave/staffLeave"));
const adminLeave_1 = __importDefault(require("../../model/admin/adminLeave/adminLeave"));
const adminAuth_1 = __importDefault(require("../../model/admin/adminAuth"));
const mongoose_1 = __importDefault(require("mongoose"));
const staffAuth_1 = __importDefault(require("../../model/staff/staffAuth"));
//admin to create leave
const createLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        const { title, days } = req.body;
        if (getAdmin) {
            if (title) {
                return res.status(400).json({
                    message: "this is a bad request , leave already exists , no need of creating two leaves with the same name",
                });
            }
            else {
                const createNewLeave = yield adminLeave_1.default.create({
                    title,
                    days,
                });
                (_a = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.adminLeave) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createNewLeave === null || createNewLeave === void 0 ? void 0 : createNewLeave._id));
                getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save();
                return res.status(201).json({
                    message: "you have just created a leave for your company .....congrats!!!",
                    data: createNewLeave,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "you are not a registered admin yet , try signing up to create a leave",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "an error occurred while creating leave",
            errMsg: error.message,
            data: error,
        });
    }
});
exports.createLeave = createLeave;
//STAFF SIDE !!!!
//THIS IS THE STAFF APPLIES FOR A LEAVE
const applyForLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { title, startDate, numberOfDays, reason } = req.body;
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        const getLeave = yield adminLeave_1.default.findOne({ title });
        if (getStaff) {
            if ((getLeave === null || getLeave === void 0 ? void 0 : getLeave.title) === title) {
                const apply = yield staffLeave_1.default.create({
                    title,
                    startDate,
                    numberOfDays,
                    remainingDays: (getLeave === null || getLeave === void 0 ? void 0 : getLeave.days) - numberOfDays,
                    reason,
                });
                (_b = getStaff === null || getStaff === void 0 ? void 0 : getStaff.staffLeave) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(apply === null || apply === void 0 ? void 0 : apply._id));
                getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
                return res.status(201).json({
                    message: "created application successfully",
                    data: apply,
                });
            }
            else {
                return res.status(400).json({
                    message: "leave title doesn't match",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "you are not a registered staff yet , try signing up to create a leave",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "an error occurred while creating leave",
            errMsg: error.message,
            data: error,
        });
    }
});
exports.applyForLeave = applyForLeave;
