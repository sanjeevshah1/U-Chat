import { Request, Response } from "express";
import { get } from "lodash";
import {
  createContact,
  getContacts,
  acceptContact,
} from "../services/contacts.service";
import Contact from "../models/contact.model";
import mongoose from "mongoose";
import { findUser } from "../services/user.service";

export const getContactsHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "res.locals.user._id");
    const contacts = await getContacts(userId);
    res.status(200).json({
      success: true,
      message: "Contacts fetched succesfully",
      contacts,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
export const getAllContactsHandler = async (req: Request, res: Response) => {
  try {
    // const userId = get(req, "res.locals.user._id");
    const contacts = await Contact.find({})
      .populate("user", "fullname email profilePicture")
      .populate("contact", "fullname email profilePicture");
    res.status(200).json({
      success: true,
      message: "Contacts fetched succesfully",
      contacts,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const deleteContactsHandler = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.deleteMany({});
    res.status(200).json({
      success: true,
      message: "Contacts delete succesfully",
      contacts,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const addContactHandler = async (req: Request, res: Response) => {
  try {
    const currentUserId = res.locals.user._id;
    const { email } = req.body;

    // 1. Find the user with the given email
    const friend = await findUser({ email });
    if (!friend) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    } else {
      console.log(friend._id);
      console.log(currentUserId);
      console.log(friend._id.toString() === currentUserId);
      // 2. Prevent adding self
      if (friend._id.toString() === currentUserId) {
        res
          .status(400)
          .json({ success: false, message: "Cannot add yourself" });
        return;
      }

      // 3. Checking if contact already exists
      const existing = await Contact.findOne({
        $or: [
          { user: currentUserId, contact: friend._id },
          { user: friend._id, contact: currentUserId },
        ],
      });

      if (existing) {
        res.status(400).json({
          success: false,
          message: "Contact already exists or pending",
        });
        return;
      }

      // 4. Create contact request
      const contactRequest = await createContact({
        user: currentUserId as mongoose.Schema.Types.ObjectId,
        contact: friend._id as mongoose.Schema.Types.ObjectId,
        status: "pending",
      });

      res.status(201).json({
        success: true,
        message: "Contact request sent",
        contact: contactRequest,
      });
    }
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const acceptContactRequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const acceptedContact = await acceptContact(id);
    res.status(200).json({
      success: true,
      message: "Request accepted",
      contact: acceptedContact,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
