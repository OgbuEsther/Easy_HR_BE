import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";

const GOOGLE_ID =
  "711746264327-ib9iaq9rb83o7p91inap2a47o3uirrbj.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";

const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";
const REFRESH =
  "1//04-3AwTjrEjYuCgYIARAAGAQSNwF-L9IrLZoaBCv22bphet8kwNV6rx1dVlYJZ44KQK_fAtkT1o7F4eT1qkn5_FhyjycjNTpSbm4";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, REFRESH);
oAuth.setCredentials({ refresh_token: REFRESH });

const adminURL = "http://localhost:5173/confirm-admin";
const staffURL = "http://localhost:5173/confirm";

export const verifyEmail = async (user: any) => {
  try {
    const accessToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
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

    const getData = path.join(__dirname, "../views/AdminSignUp.ejs");

    const readData = await ejs.renderFile(getData, {
      name: user?.name,
      email: user?.email,
      token: user?.token,
      id: user?._id,
      url: `${adminURL}/${user?._id}/${user?.token}`,
    });

    let mailerOptions = {
      from: "easyhrplayform@gmail.com",
      to: user?.email,
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
  } catch (error) {
    throw error;
  }
};

export const verifyStaffEmailByAdmin = async (user: any, admin: any) => {
  try {
    const accessToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
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

    const getData = path.join(__dirname, "../views/AdminUserSignUp.ejs");

    const readData = await ejs.renderFile(getData, {
      companyName: admin.companyname,
      name: user?.name,
      email: user?.email,
      token: user?.token,
      id: user?._id,
      url: `${staffURL}/${user?._id}/${user?.token}`,
    });

    let mailerOptions = {
      from: "easyhrplayform@gmail.com",
      to: admin?.email,
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
  } catch (error) {
    throw error;
  }
};

export const verifyStaffEmail = async (user: any) => {
  try {
    const accessToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
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

    const getData = path.join(__dirname, "../views/UserSignUp.ejs");

    const readData = await ejs.renderFile(getData, {
      name: user?.name,
      email: user?.email,
      token: user?.token,
      id: user?._id,
      url: `${staffURL}/${user?._id}/${user?.token}`,
    });

    let mailerOptions = {
      from: "easyhrplayform@gmail.com",
      to: user?.email,
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
  } catch (error) {
    throw error;
  }
};

export const finalVerifyStaffEmail = async (staff: any) => {
  try {
    const accessToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
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

    const getData = path.join(__dirname, "../views/FinalStaffVerification.ejs");

    const readData = await ejs.renderFile(getData, {
      name: staff?.name,
      companyname: staff?.companyname,
      email: staff?.email,
      token: staff?.token,
      id: staff?._id,
      OTP: staff?.OTP,
      url: `http://localhost:5173/verify-staff/${staff?._id}/${staff?.token}`,
    });

    let mailerOptions = {
      from: "easyhrplayform@gmail.com",
      to: staff?.email,
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
  } catch (error) {
    throw error;
  }
};

export const finalVerifyAdminEmail = async (staff: any, admin: any) => {
  try {
    const accessToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
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

    const getData = path.join(
      __dirname,
      "../views/FinalAdminStaffVerification.ejs",
    );

    const readData = await ejs.renderFile(getData, {
      name: staff?.name,
      companyname: admin?.name,
      email: staff?.email,
      token: staff?.token,
      id: staff?._id,
      url: `${staffURL}/${staff?._id}/${staff?.token}`,
    });

    let mailerOptions = {
      from: "easyhrplayform@gmail.com",
      to: admin?.email,
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
  } catch (error) {
    throw error;
  }
};