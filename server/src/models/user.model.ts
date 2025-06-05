import { model, Schema } from "mongoose";
import config from "config";
import bcrypt from "bcrypt";
import { UserDocument } from "../types";
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true, minLength: 3 },
    profilePicture: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

// export interface UserSchemaType {
//   email: string;
//   fullname: string;
//   password: string;
//   profilePicture: string | undefined;
// }

// export interface UserDocument extends UserSchemaType, Document {
//   createdAt: Date;
//   modifiedAt: Date;
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }

userSchema.pre<UserDocument>("save", async function (next) {
  const user = this as UserDocument;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(config.get<number>("saltFactor"));
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const User = model<UserDocument>("User", userSchema);
export default User;
