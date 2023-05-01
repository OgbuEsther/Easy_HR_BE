"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    days: {
        type: Number,
    },
});
const adminLeaveModel = (0, mongoose_1.model)("adminLeave", adminSchema);
exports.default = adminLeaveModel;
