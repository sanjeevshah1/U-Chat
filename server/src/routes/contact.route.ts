import { Router } from "express";
import requireUser from "../middlewares/requireUser";
import {
  HandleContactRequestHandlerSchema,
  AddContactHandlerSchema,
} from "../schema/contact.schema";
import {
  getContactsHandler,
  getAllContactsHandler,
  addContactHandler,
  deleteContactsHandler,
  HandleContactRequestHandler,
  showRequestsHandler,
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
  "/requests/:requestId/:action",
  requireUser,
  validateResource(HandleContactRequestHandlerSchema),
  HandleContactRequestHandler,
);

contactRoute.get("/requests", requireUser, showRequestsHandler);

export default contactRoute;
