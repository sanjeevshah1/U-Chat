import { Express } from "express";
import authRoutes from "../routes/auth.routes";
const routes = (app: Express) => {
  //Test Route
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World" });
  });

  //Auth Routes
  app.use("/auth", authRoutes);
};
export default routes;
