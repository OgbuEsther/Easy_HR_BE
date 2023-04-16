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
exports.resetPassword = exports.AdminEmailEnv = exports.emailEnv = void 0;
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const GOOGLE_ID = "1060451973749-99rp9ckrgq62aa28bh4i52kfrna58q0i.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REFRESHTOKEN = "1//04IE7jJ_6LrQxCgYIARAAGAQSNwF-L9IrfMC9oCMQkIX5jvjsx5Ry7eIKUMoIqC459mApXlsl38NWkv1dz8wpx-h7RxSg1CHpAPo";
const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground/";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);
const emailEnv = (user, company) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });
        const getToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "ogbuozichi2002@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESHTOKEN,
                // accessToken: getToken,
                accessToken: "ya29.a0Ael9sCMQQ49BM0mYbc5Ve2cM6r6QfY-UKE0U8MEorazCY49Tx4udjpoHVpWwvwqktg3sL36Ue0kb5RRYXKeyCtWJ46bFkUWoqu3-QrdZ5gx5S29v-UdzdcA-uIREc05Q_sXUhd0-l5214B9LPNB4g7GnE04WaCgYKASISARASFQF4udJht_jbJhpntyJZ4Kefz3s-Dw0163",
                // accessToken: getToken.token || "",
            },
        });
        const mailerOption = {
            from: "Easy Pay💰💸 <ogbuozichi2002@gmail.com>",
            to: user.email,
            subject: "Account verification",
            html: `<div>Welcome "${user.yourName}"  to easyHR , your just signed up under ${company.companyname} , wait for verification from the admin 
      <a href="http://localhost:2023/api/user/${user._id}/verified">verified</a>
      <br/>
      <br/>
      ${user.OTP}
        </div>`,
        };
        transporter
            .sendMail(mailerOption)
            .then(() => {
            console.log("Email Sent");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.emailEnv = emailEnv;
//verify admin email
const AdminEmailEnv = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });
        const getToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "ogbuozichi2002@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESHTOKEN,
                // accessToken: getToken,
                accessToken: "ya29.a0Ael9sCN9etRF51POLRIQ_OmkQqola55IEdmYK7ypVceTcz_-RBO-_zARR6x0nuyKcdE7XUwD02y6sfyWa6TqqZOiuD84pxh1yXcZ4yBMy-wFlbHE9EU6r4lHcYtkh0Gtl-g-1g_AdB2eIIVUq1fulbTK9wXpaCgYKAVISARASFQF4udJhNMlpPaJhmjKcxc2Qe4A2jw0163",
                // accessToken: getToken.token || "",
            },
        });
        // const { companyCode, yourName, OTP } = admin;
        // const readEjs = path.join(__dirname, "../../views/body.ejs");
        // const companyData = await ejs.renderFile(readEjs, {
        //   companyCode,
        //   yourName,
        //   OTP,
        // });
        const mailerOption = {
            from: "Easy Pay💰💸 <ogbuozichi2002@gmail.com>",
            to: admin === null || admin === void 0 ? void 0 : admin.email,
            subject: "Account verification",
            // html: companyData,
            html: `<div>Welcome "${admin.yourName}"  to easyHR , your just signed up to our platform , wait for verification from the admin
      <a href="https://easypay-teamace.netlify.app/api/user/${admin._id}/verified">verified</a>
      <br/>
      <br/>
      ${admin.OTP}
        </div>`,
        };
        transporter
            .sendMail(mailerOption)
            .then(() => {
            console.log("Email Sent");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.AdminEmailEnv = AdminEmailEnv;
const resetPassword = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });
        const getToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "techicon19@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESHTOKEN,
                // accessToken: getToken,
                accessToken: "ya29.a0Ael9sCOp1mUjffmmY5D70w-X3R2iCNqJNWkxudg3uYVTWpw4Ez2XpcPLUrdZhu3WSr7CnLHSiKzfQoU0WbnNjenICeyQKZCtJwhNDqUjy53Fowq6gbyB5vKhCRi8O3rf5uuAxeEzPuqEy4jVN2M74uTkHDgzwmQaCgYKAZQSARMSFQF4udJhxwbKl7hn-sLmpfCC5t9_rw0166",
            },
        });
        const mailerOption = {
            from: "Easy Pay💰💸 <techicon19@gmail.com>",
            to: user.email,
            subject: "Reset Password Request",
            html: `<div>Welcome ${user.userName} 
      <a href="http://localhost:2023/api/user/${user._id}/${user.token}/reset-password">verified</a>
      <br/>
      <br/>
      ${user.OTP}
        </div>`,
        };
        transporter
            .sendMail(mailerOption)
            .then(() => {
            console.log("Email Send");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.resetPassword = resetPassword;
