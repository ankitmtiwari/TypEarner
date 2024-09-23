import { Router } from "express";
import { typingTaskController, demoTypingTaskController } from "../controllers/task_controller.js";

const taskRouter=Router()


taskRouter.route('/task/:level').get(typingTaskController);
taskRouter.route('/sample').get(demoTypingTaskController);

export {taskRouter};