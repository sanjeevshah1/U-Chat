import { Request, Response } from "express";
import Message from "../models/message.model";
import cloudinary from "../utils/cloudinary.utils";
import { getReceiverSocketId, io } from "../utils/socket";
import { Types } from "mongoose";
import logger from "../utils/logger";

export const getMessagesHandler = async (req: Request, res: Response) => {
  try {
    const { id: friendId } = req.params;
    const userId = res.locals.user._id as Types.ObjectId;
    if (!friendId) {
      res.status(400).json({
        success: false,
        message: "Friend ID is required",
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by timestamp (oldest first)

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error: unknown) {
    logger.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const sendMessageHandler = async (req: Request, res: Response) => {
  try {
    const { id: friendId } = req.params;
    const userId = res.locals.user._id;
    const { text, image } = req.body;
    let imageUrl = "";
    if (image) {
      //base 64 image
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const message = await Message.create({
      senderId: userId,
      receiverId: friendId,
      text,
      image: imageUrl ?? "",
    });

    //RealTime functionality is written here with socket.io

    const recipientSocketId = getReceiverSocketId(friendId);
    if (recipientSocketId) io.to(recipientSocketId).emit("newMessage", message);

    res.status(200).json({
      success: true,
      message: "Messages sent succesfully",
      sentMessage: message,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
