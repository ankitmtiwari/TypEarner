import { Router } from "express";
const userRouters = Router();

import {
  registerUserController,
  doRegisterUserController,
  loginUserController,
  doLoginUserController,
  doLogoutController,
  dashBoardController,
} from "../controllers/user_controller.js";

//All paths starting from /api/v1/......

//register new user
userRouters.route("/register").get(registerUserController);
userRouters.route("/register").post(doRegisterUserController);

//do login
userRouters.route("/login").get(loginUserController);
userRouters.route("/login").post(doLoginUserController);

//protected routes that need logged in user
import { checkAuthMiddleware } from "../middlewares/auth_middleware.js";
userRouters.route("/dashboard").get(checkAuthMiddleware, dashBoardController);
userRouters.route("/logout").get(checkAuthMiddleware, doLogoutController);

export { userRouters };
