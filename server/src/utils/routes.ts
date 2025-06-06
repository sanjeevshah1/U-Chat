import { Express } from "express";
import authRoutes from "../routes/auth.routes";
import contactRoute from "../routes/contact.route";
import requireUser from "../middlewares/requireUser";
// import messageRoutes from "../routes/message.routes";
const routes = (app: Express) => {
  //Test Route
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World" });
  });

  //Auth Routes
  app.use("/auth", authRoutes);

  //Messages Routes
  app.use("/contacts", contactRoute);
};
export default routes;
