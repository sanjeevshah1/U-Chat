import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
    nickname: { type: String },
  },
  {
    timestamps: true,
  },
);

export interface ContactDocument {
  user: mongoose.Schema.Types.ObjectId; // The user who owns this contact list
  contact: mongoose.Schema.Types.ObjectId; // The contact user
  status: "pending" | "accepted" | "blocked";
  createdAt: Date;
  updatedAt: Date;
  nickname?: string;
}

const Contact = mongoose.model<ContactDocument>("Contact", contactSchema);
export default Contact;
