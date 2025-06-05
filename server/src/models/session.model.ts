import mongoose from "mongoose";
import { UserDocument } from "../types";
const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  },
);
export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const Session = mongoose.model<SessionDocument>("Session", sessionSchema);

export default Session;
