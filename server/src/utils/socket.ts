import { Server } from "socket.io";
import express, { Express } from "express";
import http from "http";
import log from "./logger";
import User from "../models/user.model";

const app: Express = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
export const onlineUsers = new Map<string, string>();
export function getReceiverSocketId(receiverId: string): string | undefined {
  return onlineUsers.get(receiverId);
}
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  const parsedUserId = Array.isArray(userId) ? userId[0] : userId;

  log.info("A user connected", socket.id);
  console.log("The user ID is", parsedUserId);

  if (parsedUserId) {
    onlineUsers.set(parsedUserId, socket.id);
    try {
      await User.updateOne({ _id: parsedUserId }, { isOnline: true });
    } catch (err) {
      log.error("Failed to update user online status", err);
    }
  }

  socket.on("disconnect", async () => {
    log.info("User disconnected", socket.id);
    if (parsedUserId) {
      onlineUsers.delete(parsedUserId);
      try {
        await User.updateOne({ _id: parsedUserId }, { isOnline: false });
      } catch (err) {
        log.error("Failed to update user offline status", err);
      }
    }
  });

  socket.on("message", (message) => {
    log.info("The user messaged", message);
  });

  socket.on("typing", (data) => {
    const recipientSocketId = getReceiverSocketId(data.receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("typing", {
        userId: data.userId,
        isTyping: data.isTyping,
      });
    }
  });
});

export { io, app, server };
