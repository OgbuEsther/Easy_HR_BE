import dotenv from "dotenv";
dotenv.config();

const envVariables = {
  PORT: process.env.PORT as string,
  DB_URI: process.env.DB_URI as string,
  LIVE_URI : process.env.LIVE_URI as string
};

export default envVariables;
