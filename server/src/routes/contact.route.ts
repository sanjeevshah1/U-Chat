import { Router } from "express";
import requireUser from "../middlewares/requireUser";
import {
  getContactsHandler,
  getAllContactsHandler,
  addContactHandler,
  deleteContactsHandler,
  acceptContactRequestHandler,
} from "../controllers/contact.controller";
const contactRoute = Router();
contactRoute.get("/", requireUser, getContactsHandler);
contactRoute.get("/all", getAllContactsHandler);
contactRoute.delete("/delete", requireUser, deleteContactsHandler);
contactRoute.post("/add", requireUser, addContactHandler);
contactRoute.patch("/accept/:id", requireUser, acceptContactRequestHandler);
export default contactRoute;
