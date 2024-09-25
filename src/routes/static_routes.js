import { Router } from "express";
import { aboutPageController, TNCPageController } from "../controllers/static_controller.js";

const staticRouter=Router()

staticRouter.route('/about').get(aboutPageController)
staticRouter.route('/tnc').get(TNCPageController);

export {staticRouter}