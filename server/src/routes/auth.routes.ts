import { Router } from "express";
import {
  signUpHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  updateProfileHandler,
  getProfileHandler,
  updateProfilePictureHandler,
} from "../controllers/auth.controller";
import { LoginSchema, SignUpSchema } from "../schema/user.schema";
import validateResource from "../middlewares/validateResource";
import requireUser from "../middlewares/requireUser";
const authRoute = Router();

authRoute.get("/", (req, res) => {
  res.status(200).json({ message: "auth route" });
});

authRoute.post("/signup", validateResource(SignUpSchema), signUpHandler);
authRoute.post("/login", validateResource(LoginSchema), loginHandler);
authRoute.post("/logout", logoutHandler);
authRoute.post("/refresh", refreshHandler);
authRoute.put("/profile", requireUser, updateProfileHandler);
authRoute.get("/profile", requireUser, getProfileHandler);
authRoute.patch("/profile", requireUser, updateProfilePictureHandler);

export default authRoute;
