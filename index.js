import { app } from "./app.js";
import dotenv from "dotenv"

dotenv.config({
  path: './.env'
})

const connectServer = async () => {
  app.listen(process.env.PORT, () => {
    console.log(`app listening at ${process.env.PORT}`);
  });
};

connectServer()