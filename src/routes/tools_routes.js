import { Router } from "express";
const toolsRouter = Router();

import { textCaseController, typingSpeedController} from "../controllers/tools_controller.js";

//All paths starting from /api/v1/tools......
toolsRouter.route("/text_case").get(textCaseController);
toolsRouter.route("/typing_speed").get(typingSpeedController);

export { toolsRouter };