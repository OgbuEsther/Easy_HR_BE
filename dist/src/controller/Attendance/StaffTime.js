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
exports.createClockOut = exports.createClockIn = void 0;
const StaffAttenadance_1 = __importDefault(require("../../model/staff/StaffAttendance/StaffAttenadance"));
const staffAuth_1 = __importDefault(require("../../model/staff/staffAuth"));
const mongoose_1 = __importDefault(require("mongoose"));
//clock in time
const createClockIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { date, clockIn, message, time } = req.body;
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        const getDate = new Date().toLocaleDateString();
        const getTime = new Date().toLocaleTimeString();
        const customMessage = `you clocked in at ${getTime} on ${getDate} , make sure to clock out at the right time`;
        if (getStaff) {
            const clockInTime = yield StaffAttenadance_1.default.create({
                date: getDate,
                clockIn,
                clockOut: false,
                message: customMessage,
                time: getTime,
            });
            yield ((_a = getStaff === null || getStaff === void 0 ? void 0 : getStaff.payRoll) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(clockInTime === null || clockInTime === void 0 ? void 0 : clockInTime._id)));
            yield (getStaff === null || getStaff === void 0 ? void 0 : getStaff.save());
            return res.status(201).json({
                message: "clockInTime done",
                data: clockInTime,
            });
        }
        else {
            return res.status(400).json({
                message: "not a signed in staff",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "staff couldn't clocked in",
        });
    }
});
exports.createClockIn = createClockIn;
//clock Out time
const createClockOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { date, clockOut, message, time } = req.body;
        const getDate = new Date().toLocaleDateString();
        const getTime = new Date().toLocaleTimeString();
        const customMessage = `you clocked out at ${getTime} on ${getDate}`;
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        if (getStaff) {
            const clockOutTime = yield StaffAttenadance_1.default.create({
                date: getDate,
                clockOut,
                message: customMessage,
                time: getTime,
            });
            yield ((_b = getStaff === null || getStaff === void 0 ? void 0 : getStaff.payRoll) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(clockOutTime === null || clockOutTime === void 0 ? void 0 : clockOutTime._id)));
            yield (getStaff === null || getStaff === void 0 ? void 0 : getStaff.save());
            return res.status(201).json({
                message: "clockOutTime done",
                data: clockOutTime,
            });
        }
        else {
            return res.status(400).json({
                message: "not a signed in staff",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "staff couldn't clocked out",
        });
    }
});
exports.createClockOut = createClockOut;
