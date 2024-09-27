import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

import { userRouters } from "./src/routes/user_routes.js";
import { toolsRouter } from "./src/routes/tools_routes.js";
import { taskRouter } from "./src/routes/task_routes.js";
import { staticRouter } from "./src/routes/static_routes.js";

import { homePageController } from "./src/controllers/user_controller.js";
import { inserTextController } from "./src/controllers/text_controller.js";

const app = express();

//global middleware setup
app.use(
  cors({
    origin: "*",
    credential: true,
  })
);
app.use(session({
  secret: 'your-secret-key', // Replace with a secure key
  resave: false,
  saveUninitialized: true
}));

//when data comes from form
app.use(express.json({ limit: "16kb" }));
//when data comes from url
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//static files folder assets
app.use(express.static("public"));
//to use cookies
app.use(cookieParser());

// app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'ejs');
app.use(express.static('public'))

//home page of the site
app.get('/',homePageController)

//all user auth related routed
app.use('/api/v1', userRouters)

//all tools router
app.use('/api/v1/tools', toolsRouter)

//all task related routes like sample task, or actual job task
app.use('/job', taskRouter)

//all static pages routes
app.use('/static', staticRouter)

//for temporary usage of putting data in database
app.get('/insertText', inserTextController);

//when unKnown Page request then
app.use((req, res, next) => {
  res.status(404).render("task/not_found");
});


export { app };