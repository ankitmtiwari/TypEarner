import { Router } from "express";
import { typingTaskController, demoTypingTaskController } from "../controllers/task_controller.js";
import { checkAuthMiddleware } from "../middlewares/auth_middleware.js";
import { homePageController } from "../controllers/user_controller.js";

const taskRouter=Router()

taskRouter.route('/').get(homePageController) //sending at home page if nothing to show at this route
taskRouter.route('/sample').get(demoTypingTaskController);
taskRouter.route('/sample/:level').get(demoTypingTaskController);
//protected routes
taskRouter.route('/task').get(checkAuthMiddleware, homePageController);  //sending at home page as nothing to show at this route
taskRouter.route('/task/:level').get(checkAuthMiddleware, typingTaskController);

export {taskRouter};