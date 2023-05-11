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
exports.enterAdminScore = exports.enterStaffScore = exports.createMileStone = exports.PerformanceMilestone = void 0;
const adminAuth_1 = __importDefault(require("../../model/admin/adminAuth"));
const adminPerfomanceModel_1 = __importDefault(require("../../model/admin/adminPerformance/adminPerfomanceModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const Rate_1 = __importDefault(require("../../model/admin/adminPerformance/Rate"));
const GradeD_1 = __importDefault(require("../../model/admin/adminPerformance/grades/GradeD"));
const GradesC_1 = __importDefault(require("../../model/admin/adminPerformance/grades/GradesC"));
const GradeB_1 = __importDefault(require("../../model/admin/adminPerformance/grades/GradeB"));
const staffAuth_1 = __importDefault(require("../../model/staff/staffAuth"));
const GradeA_1 = __importDefault(require("../../model/admin/adminPerformance/grades/GradeA"));
const PerformanceMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        if (getAdmin) {
            const dataFIle = yield adminAuth_1.default.findByIdAndUpdate(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin._id, {
                $push: { createPerformanceMilestone: req.body },
            }, { new: true });
            const getMilestone = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.createPerformanceMilestone[0];
            let totalSum = 0;
            const keys = Object.keys(getMilestone);
            for (let i = 0; i < keys.length; i++) {
                totalSum += getMilestone[keys[i]];
            }
            console.log("thi is total sum", totalSum > 100);
            //   dataFIle?.createPerformanceMilestone.sort
            if (totalSum > 100) {
                return res.status(400).json({
                    message: "Total performance rating shouldn't be above 100%",
                });
            }
            else {
                return res.status(201).json({
                    message: "created Performance Milestone",
                    data: dataFIle === null || dataFIle === void 0 ? void 0 : dataFIle.createPerformanceMilestone,
                    totalScore: totalSum,
                    //   okay :(totalSum += getMilestone![keys[i]])
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Admin not found",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "couldn't create  performance milestone",
            err: error.message,
            data: error,
        });
    }
});
exports.PerformanceMilestone = PerformanceMilestone;
const createMileStone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { mileStone } = req.body;
        function getDaysInMonth(year, month) {
            return new Date(year, month, 0).getDate();
        }
        const date = new Date();
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth() + 1; // 👈️ months are 0-based
        // 👇️ Current Month
        const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
        console.log(daysInCurrentMonth);
        //get actual date
        const getCurrentDate = new Date().toLocaleDateString().split("/")[1];
        const getvalue = parseInt(getCurrentDate);
        console.log(getvalue);
        console.log("getvalue", getvalue);
        if (getvalue <= 17) {
            const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
            const milestone = yield adminPerfomanceModel_1.default.create({
                mileStone,
            });
            yield ((_a = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.PerformanceMilestone) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(milestone === null || milestone === void 0 ? void 0 : milestone._id)));
            yield (getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save());
            return res.status(200).json({
                message: "milestone created",
                data: milestone,
            });
        }
        else {
            return res.status(400).json({
                message: "it's past creation time ",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "milestone not created",
            data: error,
            err: error.message,
        });
    }
});
exports.createMileStone = createMileStone;
const enterStaffScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffScore } = req.body;
        const findMileStone = yield adminPerfomanceModel_1.default.findById(req.params.MileStoneId);
        if (findMileStone) {
            const createStaffScore = yield Rate_1.default.create({
                adminScore: 0,
                staffScore,
                adminGrade: 0,
                // date : Date.getDate()
            });
            return res.status(201).json({
                message: "entered score sucessfully",
                data: createStaffScore,
            });
        }
        else {
            return res.status(400).json({
                message: "milestone has not been created yet .....be patient"
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to enter score",
            data: error,
            err: error.message,
        });
    }
});
exports.enterStaffScore = enterStaffScore;
const enterAdminScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    try {
        const { adminScore } = req.body;
        const findStaff = yield staffAuth_1.default.findById(req.params.staffId);
        const getRateModel = yield Rate_1.default.findById(req.params.rateId);
        const updateScore = yield Rate_1.default.findByIdAndUpdate(getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel._id, {
            adminScore,
        }, { new: true });
        //from 1-26
        if ((getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore) >= 1 && (getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore) <= 25) {
            const getGrade = yield GradeD_1.default.create({
                grade: "VERY POOR",
                score: getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore
            });
            yield ((_b = getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.gradeD) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(getGrade === null || getGrade === void 0 ? void 0 : getGrade._id)));
            yield (getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.save());
            return res.status(201).json({
                message: ` Your grade for this month is ${getGrade === null || getGrade === void 0 ? void 0 : getGrade.grade} `,
                data: getGrade,
                updateScore
            });
            //from 26-50
        }
        else if ((getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore) >= 26 && (getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore) <= 50) {
            const getGrade = yield GradesC_1.default.create({
                grade: "POOR",
                score: getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore
            });
            yield ((_c = getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.gradeC) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(getGrade === null || getGrade === void 0 ? void 0 : getGrade._id)));
            yield (getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.save());
            return res.status(201).json({
                message: ` Your grade for this month is ${getGrade === null || getGrade === void 0 ? void 0 : getGrade.grade} `,
                data: getGrade,
                updateScore
            });
            //from 51 -75
        }
        else if ((getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore) >= 51 && (getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore) <= 75) {
            const getGrade = yield GradeB_1.default.create({
                grade: "GOOD",
                score: getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore
            });
            yield ((_d = getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.gradeB) === null || _d === void 0 ? void 0 : _d.push(new mongoose_1.default.Types.ObjectId(getGrade === null || getGrade === void 0 ? void 0 : getGrade._id)));
            yield (getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.save());
            return res.status(201).json({
                message: ` Your grade for this month is ${getGrade === null || getGrade === void 0 ? void 0 : getGrade.grade} `,
                data: getGrade
            });
        }
        else {
            const getGrade = yield GradeA_1.default.create({
                grade: "VERY GOOD",
                score: getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.adminScore
            });
            yield ((_e = getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.gradeA) === null || _e === void 0 ? void 0 : _e.push(new mongoose_1.default.Types.ObjectId(getGrade === null || getGrade === void 0 ? void 0 : getGrade._id)));
            yield (getRateModel === null || getRateModel === void 0 ? void 0 : getRateModel.save());
            return res.status(201).json({
                message: ` Your grade for this month is ${getGrade === null || getGrade === void 0 ? void 0 : getGrade.grade} `,
                data: getGrade,
                updateScore
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to enter score",
            data: error,
            err: error.message,
        });
    }
});
exports.enterAdminScore = enterAdminScore;
