import { Request, Response } from "express";
import Message from "../models/message.model";
import cloudinary from "../utils/cloudinary.utils";
export const getMessagesHandler = async (req: Request, res: Response) => {
  try {
    const { id: friendId } = req.params;
    const userId = res.locals.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    });
    res.status(200).json({
      success: true,
      message: "Messages fetched succesfully",
      messages,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
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
      image: imageUrl,
    });

    //RealTime functionality is written here with socket.io
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
