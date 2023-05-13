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

const adminURL = "https://eazyhr.netlify.app";
const staffURL = "https://eazyhr.netlify.app";


export const verifyEmail = async (admin: any) => {
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
      name: admin?.yourName,
      email: admin?.email,
      token: admin?.token,
      companyname : admin?.companyname,
      id: admin?._id,
      url: `${adminURL}/api/admin/${admin?._id}/verify`,
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
      companyname: admin.companyname,
      name: user?.yourName,
      adminname:admin?.companyname,
      email: user?.email,
      id: user?._id,
      url: `${staffURL}/api/staff/${user?._id}/verification`,
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
      name: user?.yourName,
      email: user?.email,
      token: user?.token,
      id: user?._id,
      url: `${staffURL}/${user?._id}/verifystaff`,
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
      name: staff?.yourName,
      companyname: staff?.companyname,
      email: staff?.email,
      token: staff?.token,
      id: staff?._id,
      staffToken: staff?.staffToken,
      url: `${staffURL}/verify/${staff?._id}`,
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
      name: staff?.yourName,
      companyname: admin?.yourName,
      email: staff?.email,
      OTP: staff?.OTP,
      id: staff?._id,
      url: `${staffURL}/${staff?._id}`,
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