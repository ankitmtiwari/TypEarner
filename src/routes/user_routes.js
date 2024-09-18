import { Router } from "express";
const userRouters = Router();

import { registerUserController,doRegisterUserController, loginUserController, doLoginUserController, homePageController} from "../controllers/user_controller.js";

//All paths starting from /api/v1/......
userRouters.route("/register").get(registerUserController);
userRouters.route("/register").post(doRegisterUserController);

userRouters.route("/login").get(loginUserController);
userRouters.route("/login").post(doLoginUserController);
userRouters.route("/").get(homePageController);

export { userRouters };