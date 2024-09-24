import { Router } from "express";
import { typingTaskController, demoTypingTaskController } from "../controllers/task_controller.js";
import { checkAuthMiddleware } from "../middlewares/auth_middleware.js";

const taskRouter=Router()


taskRouter.route('/task/:level').get(checkAuthMiddleware, typingTaskController);
taskRouter.route('/sample').get(demoTypingTaskController);

export {taskRouter};