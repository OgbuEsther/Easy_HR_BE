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
exports.createClockOut = exports.createClockIn = exports.createAttendance = void 0;
const express_1 = __importDefault(require("express"));
const StaffAttenadance_1 = __importDefault(require("../../model/staff/StaffAttendance/StaffAttenadance"));
const staffAuth_1 = __importDefault(require("../../model/staff/staffAuth"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const AdminAttendance_1 = __importDefault(require("../../model/admin/adminAttendance/AdminAttendance"));
const adminAuth_1 = __importDefault(require("../../model/admin/adminAuth"));
const StaffLateNess_1 = __importDefault(require("../../model/staff/StaffAttendance/StaffLateNess"));
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
const createAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        const getTime = new Date().toLocaleTimeString();
        if (getAdmin) {
            const token = yield crypto_1.default.randomBytes(3).toString("hex");
            const createToken = yield AdminAttendance_1.default.create({
                setToken: token,
                // _id : getAdmin?._id
            });
            yield ((_a = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.SetAttendance) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createToken === null || createToken === void 0 ? void 0 : createToken._id)));
            yield (getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save());
            return res.status(201).json({
                message: "create staff token successfully",
                data: createToken
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
            message: "an error in creating attendance",
            data: error,
            error: error.message
        });
    }
});
exports.createAttendance = createAttendance;
//clock in time
const createClockIn = (req, res, ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    try {
        const { date, clockIn, message, time, setToken } = req.body;
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        const getAdminAttendanceToken = yield AdminAttendance_1.default.findOne({ setToken });
        let dataIP;
        yield axios_1.default.get("https://api.ipify.org/").then((res) => {
            dataIP = res.data;
        });
        let realData = yield run(dataIP);
        console.log(realData === null || realData === void 0 ? void 0 : realData.latitude);
        console.log(realData === null || realData === void 0 ? void 0 : realData.longitude);
        console.log(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.latitude);
        console.log(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.longitude);
        console.log(parseFloat(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.latitude));
        console.log(parseFloat(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.longitude));
        const getDate = new Date().toLocaleDateString();
        const getTime = new Date().toLocaleTimeString();
        const customMessage = `you clocked in at ${getTime} on ${getDate} , make sure to clock out at the right time`;
        if (getStaff && getAdmin) {
            if ((getAdminAttendanceToken === null || getAdminAttendanceToken === void 0 ? void 0 : getAdminAttendanceToken.setToken) === setToken) {
                if ((getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.expectedClockIn) <= getTime) {
                    if ((realData === null || realData === void 0 ? void 0 : realData.latitude) === parseFloat(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.latitude) &&
                        (realData === null || realData === void 0 ? void 0 : realData.longitude) === parseFloat(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.longitude)) {
                        const clockInTime = yield StaffAttenadance_1.default.create({
                            date: getDate,
                            clockIn,
                            clockOut: false,
                            message: customMessage,
                            time: getTime,
                            token: setToken,
                            nameOfStaff: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName
                        });
                        yield ((_b = getStaff === null || getStaff === void 0 ? void 0 : getStaff.Attendance) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(clockInTime === null || clockInTime === void 0 ? void 0 : clockInTime._id)));
                        yield (getStaff === null || getStaff === void 0 ? void 0 : getStaff.save());
                        yield (getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.viewStaffAttendance.push(new mongoose_1.default.Types.ObjectId(clockInTime === null || clockInTime === void 0 ? void 0 : clockInTime._id)));
                        yield (getAdminAttendanceToken === null || getAdminAttendanceToken === void 0 ? void 0 : getAdminAttendanceToken.save());
                        yield ((_c = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.viewStaffHistory) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(clockInTime === null || clockInTime === void 0 ? void 0 : clockInTime._id)));
                        getAdmin.viewStaffHistory.push(new mongoose_1.default.Types.ObjectId(clockInTime === null || clockInTime === void 0 ? void 0 : clockInTime._id));
                        yield ((_d = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.viewAbsentStaff) === null || _d === void 0 ? void 0 : _d.pull(new mongoose_1.default.Types.ObjectId(clockInTime === null || clockInTime === void 0 ? void 0 : clockInTime._id)));
                        yield (getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save());
                        return res.status(201).json({
                            message: "clockInTime done",
                            data: clockInTime,
                        });
                    }
                    else {
                        return res.status(400).json({
                            message: "you are not within the office premises"
                        });
                    }
                }
                else {
                    const clockInTime = yield StaffLateNess_1.default.create({
                        date: getDate,
                        clockIn,
                        clockOut: false,
                        message: customMessage,
                        time: getTime,
                        token: setToken,
                        nameOfStaff: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName
                    });
                    (_e = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.viewLateStaff) === null || _e === void 0 ? void 0 : _e.push(new mongoose_1.default.Types.ObjectId(clockInTime === null || clockInTime === void 0 ? void 0 : clockInTime._id));
                    return res.status(400).json({
                        message: "you are late  "
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "token doesn't match"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "couldn't get staff or admin"
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "staff couldn't clocked in",
            data: error,
            err: error === null || error === void 0 ? void 0 : error.message
        });
    }
});
exports.createClockIn = createClockIn;
//clock Out time
const createClockOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const { date, clockOut, message, time, setToken } = req.body;
        const getDate = new Date().toLocaleDateString();
        const getTime = new Date().toLocaleTimeString();
        const getAdminAttendanceToken = yield AdminAttendance_1.default.findOne({ setToken });
        const customMessage = `you clocked out at ${getTime} on ${getDate}`;
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        if (getStaff && getAdmin) {
            if ((getAdminAttendanceToken === null || getAdminAttendanceToken === void 0 ? void 0 : getAdminAttendanceToken.setToken) === setToken) {
                const clockOutTime = yield StaffAttenadance_1.default.create({
                    date: getDate,
                    clockOut,
                    clockIn: false,
                    message: customMessage,
                    time: getTime,
                    token: setToken,
                    nameOfStaff: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName
                });
                yield ((_f = getStaff === null || getStaff === void 0 ? void 0 : getStaff.Attendance) === null || _f === void 0 ? void 0 : _f.push(new mongoose_1.default.Types.ObjectId(clockOutTime === null || clockOutTime === void 0 ? void 0 : clockOutTime._id)));
                yield (getStaff === null || getStaff === void 0 ? void 0 : getStaff.save());
                yield (getAdminAttendanceToken === null || getAdminAttendanceToken === void 0 ? void 0 : getAdminAttendanceToken.viewStaffAttendance.push(new mongoose_1.default.Types.ObjectId(clockOutTime === null || clockOutTime === void 0 ? void 0 : clockOutTime._id)));
                yield (getAdminAttendanceToken === null || getAdminAttendanceToken === void 0 ? void 0 : getAdminAttendanceToken.save());
                return res.status(201).json({
                    message: "clockOutTime done",
                    data: clockOutTime,
                });
            }
            else {
                return res.status(400).json({
                    message: "token doesn't match"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "couldn't get staff"
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "staff couldn't clocked out",
            data: error,
            err: error === null || error === void 0 ? void 0 : error.message
        });
    }
});
exports.createClockOut = createClockOut;
