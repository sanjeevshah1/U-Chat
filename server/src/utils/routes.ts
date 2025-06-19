import { Express } from "express";
import authRoutes from "../routes/auth.routes";
import contactRoute from "../routes/contact.route";
import User from "../models/user.model";
import messageRoutes from "../routes/message.routes";

const routes = (app: Express) => {
  //Test Route
  app.get("/api/", (req, res) => {
    res.status(200).json({ message: "Hello World" });
  });
  app.get("/api/users", async (req, res) => {
    const users = await User.find({});

    res.status(200).json({ data: users });
  });

  //Auth Routes
  app.use("/api/auth", authRoutes);

  app.use("/api/contacts", contactRoute);

  //Messages Routes
  app.use("/api/messages", messageRoutes);
};
export default routes;
