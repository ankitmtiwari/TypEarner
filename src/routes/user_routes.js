import { Router } from "express";
const userRouters = Router();

import { registerUserController, loginUserController} from "../controllers/user_controller.js";

//All paths starting from /api/v1/......
userRouters.route("/register").post(registerUserController);
userRouters.route("/register").get(registerUserController);
userRouters.route("/login").get(loginUserController);

export { userRouters };