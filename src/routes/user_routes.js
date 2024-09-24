import { Router } from "express";
const userRouters = Router();

import {
  registerUserController,
  doRegisterUserController,
  loginUserController,
  doLoginUserController,
  doLogoutController,
  dashBoardController,
  typingTaskController,
  demoTypingTaskController,
} from "../controllers/user_controller.js";

//All paths starting from /api/v1/......
userRouters.route("/register").get(registerUserController);
userRouters.route("/register").post(doRegisterUserController);

userRouters.route("/login").get(loginUserController);
userRouters.route("/login").post(doLoginUserController);

import { checkAuthMiddleware } from "../middlewares/auth_middleware.js";
userRouters.route("/logout").get(checkAuthMiddleware, doLogoutController);
userRouters.route("/dashboard").get(checkAuthMiddleware, dashBoardController);
userRouters.route("/typing_task").get(checkAuthMiddleware, typingTaskController);
userRouters.route("/demo_task").get(demoTypingTaskController);

export { userRouters };
