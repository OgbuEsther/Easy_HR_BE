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
exports.PerformanceMilestone = void 0;
const adminAuth_1 = __importDefault(require("../../model/admin/adminAuth"));
const PerformanceMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        if (getAdmin) {
            const dataFIle = yield adminAuth_1.default.findByIdAndUpdate(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin._id, {
                $push: { createPerformanceMilestone: req.body },
            }, { new: true });
            dataFIle === null || dataFIle === void 0 ? void 0 : dataFIle.createPerformanceMilestone.sort((a, b) => a - b);
            const getMilestone = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.createPerformanceMilestone[0];
            let totalSum = 0;
            const keys = Object.keys(getMilestone);
            for (let i = 0; i < keys.length; i++) {
                totalSum += getMilestone[keys[i]];
            }
            if (totalSum > 100) {
                return res.status(400).json({
                    message: "Total performance rating shouldn't be above 100%"
                });
            }
            else {
                return res.status(201).json({
                    message: "created Performance Milestone",
                    data: dataFIle === null || dataFIle === void 0 ? void 0 : dataFIle.createPerformanceMilestone,
                    totalScore: totalSum
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Admin not found"
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
