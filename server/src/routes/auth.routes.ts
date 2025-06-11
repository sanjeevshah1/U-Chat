import { Router } from "express";
import { searchUserHandler } from "../controllers/auth.controller";
import {
  signUpHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  updateProfileHandler,
  getProfileHandler,
  updateProfilePictureHandler,
} from "../controllers/auth.controller";
import {
  LoginSchema,
  SignUpSchema,
  updateProfileSchema,
} from "../schema/user.schema";
import { SearchUserSchema } from "../schema/user.schema";
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
authRoute.put(
  "/profile",
  requireUser,
  validateResource(updateProfileSchema),
  updateProfileHandler,
);
authRoute.get("/profile", requireUser, getProfileHandler);
authRoute.patch("/profilepicture", requireUser, updateProfilePictureHandler);
authRoute.patch("/profile", requireUser, updateProfileHandler);
authRoute.get(
  "/users/search",
  validateResource(SearchUserSchema),
  searchUserHandler,
);
export default authRoute;
