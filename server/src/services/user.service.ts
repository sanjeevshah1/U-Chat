import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { UserDocument, UserWithoutPassword } from "../types";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import config from "config";
import { UpdateProfileSchemaType } from "../schema/user.schema";
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

export const updateUser = async ({
  id,
  updates
}: {
  id: string;
  updates: UpdateProfileSchemaType["body"]["updates"];
}) => {
  try {
    if (!updates) {
      throw new Error("No updates provided");
    }
    if (updates.password) {
      const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
      const hash = bcrypt.hashSync(updates.password, salt);
      updates.password = hash;
    }

    const updatedUser = await User.updateOne({ _id: id }, updates);
    return updatedUser;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong",
    );
  }
};
