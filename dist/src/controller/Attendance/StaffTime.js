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
//clock in time
const createClockIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, clockIn, message, time } = req.body;
        const getDate = new Date().toLocaleDateString();
        const getTime = new Date().toLocaleTimeString();
        const customMessage = `you clocked in at ${getTime} on ${getDate} , make sure to clock out at the right time`;
        const clockInTime = yield StaffAttenadance_1.default.create({
            date: getDate,
            clockIn,
            message: customMessage,
            time: getTime,
        });
        return res.status(201).json({
            message: "clockInTime done",
            data: clockInTime,
        });
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
    try {
        const { date, clockOut, message, time } = req.body;
        const getDate = new Date().toLocaleDateString();
        const getTime = new Date().toLocaleTimeString();
        const customMessage = `you clocked out at ${getTime} on ${getDate}`;
        const clockOutTime = yield StaffAttenadance_1.default.create({
            date: getDate,
            clockOut,
            message: customMessage,
            time: getTime,
        });
        return res.status(201).json({
            message: "clockOutTime done",
            data: clockOutTime,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "staff couldn't clocked out",
        });
    }
});
exports.createClockOut = createClockOut;
