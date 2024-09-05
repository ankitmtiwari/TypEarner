import { Router } from "express";
const userRouters = Router();

import { registerUserController} from "../controllers/user_controller.js";

//All paths starting from /api/v1/......
userRouters.route("/register").post(registerUserController);
userRouters.route("/register").get(registerUserController);

export { userRouters };