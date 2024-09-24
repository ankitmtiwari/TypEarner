import { Router } from "express";
import { typingTaskController, demoTypingTaskController } from "../controllers/task_controller.js";
import { checkAuthMiddleware } from "../middlewares/auth_middleware.js";
import { homePageController } from "../controllers/user_controller.js";

const taskRouter=Router()

taskRouter.route('/').get(homePageController)
taskRouter.route('/task').get(checkAuthMiddleware, typingTaskController);
taskRouter.route('/task/:level').get(checkAuthMiddleware, typingTaskController);
taskRouter.route('/sample').get(demoTypingTaskController);

export {taskRouter};