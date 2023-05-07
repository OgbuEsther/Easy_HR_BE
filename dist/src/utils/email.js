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
exports.finalVerifyAdminEmail = exports.finalVerifyStaffEmail = exports.verifyStaffEmail = exports.verifyStaffEmailByAdmin = exports.verifyEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const GOOGLE_ID = "711746264327-ib9iaq9rb83o7p91inap2a47o3uirrbj.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";
const REFRESH = "1//04-3AwTjrEjYuCgYIARAAGAQSNwF-L9IrLZoaBCv22bphet8kwNV6rx1dVlYJZ44KQK_fAtkT1o7F4eT1qkn5_FhyjycjNTpSbm4";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, REFRESH);
oAuth.setCredentials({ refresh_token: REFRESH });
const adminURL = "https://easy-hr.netlify.app";
const staffURL = "https://easy-hr.netlify.app";
const verifyEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "easyhrplayform@gmail.com",
                type: "OAuth2",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: REFRESH,
                accessToken: accessToken.token,
            },
        });
        const getData = path_1.default.join(__dirname, "../views/AdminSignUp.ejs");
        const readData = yield ejs_1.default.renderFile(getData, {
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            token: user === null || user === void 0 ? void 0 : user.token,
            id: user === null || user === void 0 ? void 0 : user._id,
            url: `${adminURL}/api/admin/${user === null || user === void 0 ? void 0 : user._id}/verify`,
        });
        let mailerOptions = {
            from: "easyhrplayform@gmail.com",
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "Email Verification",
            html: readData,
        };
        transporter
            .sendMail(mailerOptions)
            .then(() => {
            console.log("Email sent!");
        })
            .catch((err) => {
            throw err;
        });
    }
    catch (error) {
        throw error;
    }
});
exports.verifyEmail = verifyEmail;
const verifyStaffEmailByAdmin = (user, admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "easyhrplayform@gmail.com",
                type: "OAuth2",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: REFRESH,
                accessToken: accessToken.token,
            },
        });
        const getData = path_1.default.join(__dirname, "../views/AdminUserSignUp.ejs");
        const readData = yield ejs_1.default.renderFile(getData, {
            companyName: admin.companyname,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            token: user === null || user === void 0 ? void 0 : user.token,
            id: user === null || user === void 0 ? void 0 : user._id,
            url: `${staffURL}/api/staff${user === null || user === void 0 ? void 0 : user._id}/verification`,
        });
        let mailerOptions = {
            from: "easyhrplayform@gmail.com",
            to: admin === null || admin === void 0 ? void 0 : admin.email,
            subject: "Staff Email Verification",
            html: readData,
        };
        transporter
            .sendMail(mailerOptions)
            .then(() => {
            console.log("Email sent!");
        })
            .catch((err) => {
            throw err;
        });
    }
    catch (error) {
        throw error;
    }
});
exports.verifyStaffEmailByAdmin = verifyStaffEmailByAdmin;
const verifyStaffEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "easyhrplayform@gmail.com",
                type: "OAuth2",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: REFRESH,
                accessToken: accessToken.token,
            },
        });
        const getData = path_1.default.join(__dirname, "../views/UserSignUp.ejs");
        const readData = yield ejs_1.default.renderFile(getData, {
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            token: user === null || user === void 0 ? void 0 : user.token,
            id: user === null || user === void 0 ? void 0 : user._id,
            url: `${staffURL}/${user === null || user === void 0 ? void 0 : user._id}/${user === null || user === void 0 ? void 0 : user.token}/verify`,
        });
        let mailerOptions = {
            from: "easyhrplayform@gmail.com",
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "Email Verification",
            html: readData,
        };
        transporter
            .sendMail(mailerOptions)
            .then(() => {
            console.log("Email sent!");
        })
            .catch((err) => {
            throw err;
        });
    }
    catch (error) {
        throw error;
    }
});
exports.verifyStaffEmail = verifyStaffEmail;
const finalVerifyStaffEmail = (staff) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "easyhrplayform@gmail.com",
                type: "OAuth2",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: REFRESH,
                accessToken: accessToken.token,
            },
        });
        const getData = path_1.default.join(__dirname, "../views/FinalStaffVerification.ejs");
        const readData = yield ejs_1.default.renderFile(getData, {
            name: staff === null || staff === void 0 ? void 0 : staff.name,
            companyname: staff === null || staff === void 0 ? void 0 : staff.companyname,
            email: staff === null || staff === void 0 ? void 0 : staff.email,
            token: staff === null || staff === void 0 ? void 0 : staff.token,
            id: staff === null || staff === void 0 ? void 0 : staff._id,
            OTP: staff === null || staff === void 0 ? void 0 : staff.OTP,
            url: `http://localhost:5173/verify-staff/${staff === null || staff === void 0 ? void 0 : staff._id}/${staff === null || staff === void 0 ? void 0 : staff.token}`,
        });
        let mailerOptions = {
            from: "easyhrplayform@gmail.com",
            to: staff === null || staff === void 0 ? void 0 : staff.email,
            subject: "Email Verification",
            html: readData,
        };
        transporter
            .sendMail(mailerOptions)
            .then(() => {
            console.log("Email sent!");
        })
            .catch((err) => {
            throw err;
        });
    }
    catch (error) {
        throw error;
    }
});
exports.finalVerifyStaffEmail = finalVerifyStaffEmail;
const finalVerifyAdminEmail = (staff, admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "easyhrplayform@gmail.com",
                type: "OAuth2",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: REFRESH,
                accessToken: accessToken.token,
            },
        });
        const getData = path_1.default.join(__dirname, "../views/FinalAdminStaffVerification.ejs");
        const readData = yield ejs_1.default.renderFile(getData, {
            name: staff === null || staff === void 0 ? void 0 : staff.name,
            companyname: admin === null || admin === void 0 ? void 0 : admin.name,
            email: staff === null || staff === void 0 ? void 0 : staff.email,
            token: staff === null || staff === void 0 ? void 0 : staff.token,
            id: staff === null || staff === void 0 ? void 0 : staff._id,
            url: `${staffURL}/${staff === null || staff === void 0 ? void 0 : staff._id}/${staff === null || staff === void 0 ? void 0 : staff.token}`,
        });
        let mailerOptions = {
            from: "easyhrplayform@gmail.com",
            to: admin === null || admin === void 0 ? void 0 : admin.email,
            subject: "Email Verification",
            html: readData,
        };
        transporter
            .sendMail(mailerOptions)
            .then(() => {
            console.log("Email sent!");
        })
            .catch((err) => {
            throw err;
        });
    }
    catch (error) {
        throw error;
    }
});
exports.finalVerifyAdminEmail = finalVerifyAdminEmail;
