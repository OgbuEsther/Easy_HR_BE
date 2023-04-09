import { Document } from "mongoose";

export interface Iuser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  confirmpassword: string;
}

export interface IuserDocument extends Document, Iuser {
  comparePassword(password: string): Promise<boolean>;
}
