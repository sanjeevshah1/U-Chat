import { Router } from "express";
import requireUser from "../middlewares/requireUser";
import {
  getMessagesHandler,
  sendMessageHandler,
} from "../controllers/message.controller";
import validateResource from "../middlewares/validateResource";
import {
  GetMessageHandlerSchema,
  SendMessageHandlerSchema,
} from "../schema/message.schema";
const messageRoutes = Router();

messageRoutes.get(
  "/:id",
  requireUser,
  validateResource(GetMessageHandlerSchema),
  getMessagesHandler,
);

messageRoutes.post(
  "/send/:id",
  requireUser,
  validateResource(SendMessageHandlerSchema),
  sendMessageHandler,
);
export default messageRoutes;
