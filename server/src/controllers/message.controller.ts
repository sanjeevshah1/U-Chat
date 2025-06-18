import { Request, Response } from "express";
import Message from "../models/message.model";
import cloudinary from "../utils/cloudinary.utils";
import { getReceiverSocketId, io } from "../utils/socket";
import { Types } from "mongoose";

export const getMessagesHandler = async (req: Request, res: Response) => {
  try {
    const { id: friendId } = req.params;
    const userId = res.locals.user._id as Types.ObjectId;
    console.log("the user id is", userId);
    console.log("the friend id is", friendId);
    if (!friendId) {
      return res.status(400).json({
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

    console.log("Fetched messages:", messages);

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error: unknown) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const sendMessageHandler = async (req: Request, res: Response) => {
  console.log("Executing message send");
  try {
    const { id: friendId } = req.params;
    const userId = res.locals.user._id;
    const { text, image } = req.body;
    console.log("the message is", text);
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
