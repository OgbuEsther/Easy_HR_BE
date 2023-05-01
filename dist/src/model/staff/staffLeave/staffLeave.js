"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const staffSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    days: {
        type: Number,
    },
});
const staffLeaveModel = (0, mongoose_1.model)("staffLeave", staffSchema);
exports.default = staffLeaveModel;
