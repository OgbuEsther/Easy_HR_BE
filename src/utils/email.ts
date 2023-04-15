import { google } from "googleapis";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs"

const GOOGLE_ID: string =
  "1060451973749-99rp9ckrgq62aa28bh4i52kfrna58q0i.apps.googleusercontent.com";
const GOOGLE_SECRET: string = "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";
const GOOGLE_REFRESHTOKEN: string =
  "1//04DCkd9H0B0XSCgYIARAAGAQSNwF-L9IrhmaDfPlGL9Ticf7syIfx3-RtXsLiKq9w6Z9Xq6FVCpLuua2t5ReqvLAB_uIiw7uztVY";
const GOOGLE_REDIRECT: string =
  "https://developers.google.com/oauthplayground/";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

export const emailEnv = async (user: any , company:any) => {
  try {
    oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });
    const getToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        type: "OAuth2",
        user: "ogbuozichi2002@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESHTOKEN,
        // accessToken: getToken,
        accessToken:
          "ya29.a0Ael9sCMQQ49BM0mYbc5Ve2cM6r6QfY-UKE0U8MEorazCY49Tx4udjpoHVpWwvwqktg3sL36Ue0kb5RRYXKeyCtWJ46bFkUWoqu3-QrdZ5gx5S29v-UdzdcA-uIREc05Q_sXUhd0-l5214B9LPNB4g7GnE04WaCgYKASISARASFQF4udJht_jbJhpntyJZ4Kefz3s-Dw0163",
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
  } catch (error) {
    console.log(error);
  }
};

//verify admin email
export const AdminEmailEnv = async (admin: any) => {
  try {
    oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });
    const getToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        type: "OAuth2",
        user: "ogbuozichi2002@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESHTOKEN,
        // accessToken: getToken,
        accessToken:
          "ya29.a0Ael9sCMQQ49BM0mYbc5Ve2cM6r6QfY-UKE0U8MEorazCY49Tx4udjpoHVpWwvwqktg3sL36Ue0kb5RRYXKeyCtWJ46bFkUWoqu3-QrdZ5gx5S29v-UdzdcA-uIREc05Q_sXUhd0-l5214B9LPNB4g7GnE04WaCgYKASISARASFQF4udJht_jbJhpntyJZ4Kefz3s-Dw0163",
        // accessToken: getToken.token || "",
      },
    });
    
    const {companyCode , yourName , OTP} = admin
    const readEjs = path.join(__dirname , "../../views/index.ejs")

    const companyData = await ejs.renderFile(readEjs , {companyCode , yourName , OTP})

    const mailerOption = {
      from: "Easy Pay💰💸 <ogbuozichi2002@gmail.com>",
      to: admin.email,
      subject: "Account verification",
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
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (user: any) => {
  try {
    oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });
    const getToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        type: "OAuth2",
        user: "techicon19@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESHTOKEN,
        // accessToken: getToken,
        accessToken:
          "ya29.a0Ael9sCOp1mUjffmmY5D70w-X3R2iCNqJNWkxudg3uYVTWpw4Ez2XpcPLUrdZhu3WSr7CnLHSiKzfQoU0WbnNjenICeyQKZCtJwhNDqUjy53Fowq6gbyB5vKhCRi8O3rf5uuAxeEzPuqEy4jVN2M74uTkHDgzwmQaCgYKAZQSARMSFQF4udJhxwbKl7hn-sLmpfCC5t9_rw0166",
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
  } catch (error) {
    console.log(error);
  }
};
