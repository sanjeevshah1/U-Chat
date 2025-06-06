import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { UserDocument, UserWithoutPassword } from "../types";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import config from "config";
import { UpdateUserSchemaType } from "../schema/user.schema";
export const createUser = async (input: {
  email: string;
  fullname: string;
  password: string;
  profilePicture: string | undefined;
}) => {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), "password");
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Something went wrong while creating user in createUser Service",
    );
  }
};

export async function findUser(query: FilterQuery<UserDocument>) {
  try {
    return await User.findOne(query).lean();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Omit<UserDocument, "password"> | false> {
  try {
    const user: UserDocument | null = await User.findOne({ email });
    if (!user) return false;

    const isValid = await user.comparePassword(password);
    if (!isValid) return false;

    return omit(user.toJSON(), "password") as UserWithoutPassword;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
}

export const updateUser = async (body: UpdateUserSchemaType["body"]) => {
  try {
    const user = await User.findOne({ email: body.email });
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(body.password);
    if (!isMatch) throw new Error("Password does not match");

    if (body.updates.password) {
      const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
      const hash = bcrypt.hashSync(body.updates.password, salt);
      body.updates.password = hash;
    }
    // if (body.updates.profilePicture) {
    //   const uploadResponse = await cloudinary.uploader.upload(profilePicture);
    // }

    const updatedUser = await User.updateOne(
      { email: body.email },
      body.updates,
    );
    return updatedUser;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong",
    );
  }
};
