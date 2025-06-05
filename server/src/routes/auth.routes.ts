import { Router } from "express";
import {
  signUpHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  updateProfileHandler,
} from "../controllers/auth.controller";
import { LoginSchema, SignUpSchema } from "../schema/user.schema";
import validateResource from "../middlewares/validateResource";
const authRoute = Router();

authRoute.get("/", (req, res) => {
  res.status(200).json({ message: "auth route" });
});

authRoute.post("/signup", validateResource(SignUpSchema), signUpHandler);

authRoute.post("/login", validateResource(LoginSchema), loginHandler);

authRoute.post("/logout", logoutHandler);
authRoute.post("/refresh", refreshHandler);
authRoute.put("/profile", updateProfileHandler);

export default authRoute;
