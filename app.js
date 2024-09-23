import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { userRouters } from "./src/routes/user_routes.js";
import { toolsRouter } from "./src/routes/tools_routes.js";
import { taskRouter } from "./src/routes/task_routes.js";
import { homePageController, aboutPageController, TNCPageController } from "./src/controllers/user_controller.js";
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

app.use('/api/v1', userRouters)
app.use('/api/v1/tools', toolsRouter)
app.use('/job', taskRouter)

app.get('/', homePageController)
app.get('/about', aboutPageController)
app.get('/tnc', TNCPageController);
app.get('/insertText', inserTextController);

export { app };