import Contact, { ContactDocument } from "../models/contact.model";
import mongoose from "mongoose";
export const getContacts = async (id: string): Promise<ContactDocument[]> => {
  try {
    const contacts = await Contact.find({
      $or: [
        { user: id, status: "accepted" },
        { contact: id, status: "accepted" },
      ],
    });
    return contacts;
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

export const acceptContact = async (id: string) => {
  try {
    const acceptedContact = await Contact.findByIdAndUpdate(
      { _id: id },
      { status: "accepted" },
      { new: true },
    );
    return acceptedContact;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
