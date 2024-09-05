import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { userRouters } from "./src/routes/user_routes.js";

const app = express();

//global middleware setup
app.use(
  cors({
    origin: "*",
    credential: true,
  })
);

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
app.use(express.static(path.join('public')))

app.use('/api/v1', userRouters)

export { app };