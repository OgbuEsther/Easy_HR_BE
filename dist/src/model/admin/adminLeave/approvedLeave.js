"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const staffSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    startDate: {
        type: String,
    },
    numberOfDays: {
        type: Number
    },
    remainingDays: {
        type: Number
    },
    reason: {
        type: String
    },
    approved: {
        type: Boolean
    }
}, { timestamps: true });
const approvedLeave = (0, mongoose_1.model)("staffLeave", staffSchema);
exports.default = approvedLeave;
