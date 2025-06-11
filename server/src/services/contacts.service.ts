import Contact from "../models/contact.model";
import mongoose from "mongoose";
import User from "../models/user.model";
import { UserDocument } from "../types";
interface PopulatedContact {
  _id: string;
  status: "pending" | "accepted";
  createdAt: Date;
  user: UserDocument;
  contact: UserDocument;
}
export const getContacts = async (id: string) => {
  try {
    const contacts = await Contact.find({
      $or: [
        { user: id, status: "accepted" },
        { contact: id, status: "accepted" },
      ],
    })
      .select("-__v -updatedAt")
      .populate("user", "fullname profilePicture coverPicture isOnline")
      .populate("contact", "fullname profilePicture coverPicture isOnline");

    // Type assertion: we expect each to be a PopulatedContact
    const friends = (contacts as unknown as PopulatedContact[]).map(
      (contact) => {
        const friend =
          (contact.user._id as mongoose.Schema.Types.ObjectId).toString() === id
            ? contact.contact
            : contact.user;

        return {
          _id: contact._id.toString(),
          status: contact.status,
          createdAt: contact.createdAt,
          friend,
        };
      },
    );

    return friends;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const createContact = async ({
  user,
  contact,
  status,
}: {
  user: mongoose.Schema.Types.ObjectId;
  contact: mongoose.Schema.Types.ObjectId;
  status: string;
}) => {
  try {
    const createdContact = await Contact.create({ user, contact, status });
    return createdContact;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const handleRequest = async (
  requestId: string,
  action: "accept" | "reject",
) => {
  try {
    const handledContact = await Contact.findByIdAndUpdate(
      { _id: requestId },
      { status: action === "accept" ? "accepted" : "rejected" },
      { new: true },
    );
    return handledContact;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const showRequests = async (id: string) => {
  try {
    const requests = await Contact.find({
      contact: id,
      status: "pending",
    })
      .populate("user", "fullname email profilePicture")
      .select("-__v -updatedAt");
    return requests;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const searchUsers = async (q: string) => {
  try {
    const regex = new RegExp(q, "i");
    const users = await User.find({
      $or: [{ email: regex }, { fullname: regex }],
    }).select("-password -__v");
    return users;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
