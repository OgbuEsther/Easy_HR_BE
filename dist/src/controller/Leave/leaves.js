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
exports.createLeave = void 0;
const adminLeave_1 = __importDefault(require("../../model/admin/adminLeave/adminLeave"));
const adminAuth_1 = __importDefault(require("../../model/admin/adminAuth"));
const mongoose_1 = __importDefault(require("mongoose"));
//admin to create leave
const createLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        const { title, days } = req.body;
        if (getAdmin) {
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
