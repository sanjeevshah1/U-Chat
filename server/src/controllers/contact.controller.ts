import { Request, Response } from "express";
import { get } from "lodash";
import {
  createContact,
  getContacts,
  handleRequest,
  showRequests,
} from "../services/contacts.service";
import Contact from "../models/contact.model";
import mongoose from "mongoose";
import { findUser } from "../services/user.service";
import {
  HandleContactRequestHandlerInput,
  AddContactHandlerInput,
} from "../schema/contact.schema";
import { io } from "./../utils/socket";
import { onlineUsers } from "./../utils/socket";

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

export const addContactHandler = async (
  req: Request<object, object, AddContactHandlerInput["body"]>,
  res: Response,
) => {
  try {
    const currentUserId = res.locals.user._id;
    const { recipientId } = req.body;

    // 1. Find the user with the given email
    const friend = await findUser({ _id: recipientId });
    if (!friend) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    } else {
      // 2. Prevent adding self
      if (recipientId === currentUserId) {
        res
          .status(400)
          .json({ success: false, message: "Cannot add yourself" });
        return;
      }

      // 3. Checking if contact already exists
      const existing = await Contact.findOne({
        $or: [
          { user: currentUserId, contact: recipientId },
          { user: recipientId, contact: currentUserId },
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

      const recipientSocketId = onlineUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("friendRequestReceived");
      }

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

export const HandleContactRequestHandler = async (
  req: Request<HandleContactRequestHandlerInput["params"]>,
  res: Response,
) => {
  try {
    const { requestId, action } = req.params;
    const handledContact = await handleRequest(requestId, action);
    res.status(200).json({
      success: true,
      message: action === "accept" ? "Request accepted" : "Request Rejected",
      contact: handledContact,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const showRequestsHandler = async (req: Request, res: Response) => {
  try {
    const id = res.locals.user._id;

    const requests = await showRequests(id);
    res.status(200).json({
      success: true,
      message: "Requests fetched",
      requests,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
