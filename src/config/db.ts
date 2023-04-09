import mongoose from "mongoose";
import envVariables from "./environmentVariables";

const dbConfig = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(envVariables.DB_URI);
    console.log(`connected to database on port ${conn.connection.host}`);
  } catch (error) {
    console.log(`failed to connect to database`);
  }
};

export default dbConfig;
