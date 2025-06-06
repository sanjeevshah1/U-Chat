import { Router } from "express";
import requireUser from "../middlewares/requireUser";
import {
  AcceptContactRequestHandlerSchema,
  AddContactHandlerSchema,
} from "../schema/contact.schema";
import {
  getContactsHandler,
  getAllContactsHandler,
  addContactHandler,
  deleteContactsHandler,
  acceptContactRequestHandler,
} from "../controllers/contact.controller";
import validateResource from "../middlewares/validateResource";
const contactRoute = Router();
contactRoute.get("/", requireUser, getContactsHandler);
contactRoute.get("/all", getAllContactsHandler);
contactRoute.delete("/delete", requireUser, deleteContactsHandler);
contactRoute.post(
  "/add",
  requireUser,
  validateResource(AddContactHandlerSchema),
  addContactHandler,
);
contactRoute.patch(
  "/accept/:id",
  requireUser,
  validateResource(AcceptContactRequestHandlerSchema),
  acceptContactRequestHandler,
);
export default contactRoute;
