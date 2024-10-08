import jwt from "jsonwebtoken";
import { userModel } from "../models/user_model.js";

export const checkAuthMiddleware = async (req, res, next) => {
  try {
    // console.log("CAME IN AUTH MIDDLEWARE");
    const accessToken =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!accessToken) {
      req.session.returnTo=req.originalUrl;
      return res
        .status(401)
        .render('auth/login', { success: false, message: "Unauthorised request Please log in", data: {} });
    }

    // console.log("Middleware access:", accessToken);

    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
  
    );

    //find the user from the uid of access token
    const user = await userModel
      .findById(decodedAccessToken?._id)
      .select("-password");

    //error if there is no user with the access token uid
    if (!user) {
      req.session.returnTo=req.originalUrl;
      return res
        .status(401)
        .render('auth/login',{ success: false, message: "Invalid Login Please Login again", date: {} });
    }

    // console.log(user);
    //error if user account is deleted
    if (user.isAcDeleted) {
      return res.status(400).send({
        success: false,
        message: "Account Deleted, Need to recover",
        data: {},
      });
    }

    req.user = user;
    // console.log("Authorization Done");
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).render('auth/login', {
        success: false,
        message: "Session expired. Please log in again.",
        data: {}
      });
    } else {
      return res.status(401).send({
        success: false,
        message: error?.message || "Invalid access token",
        data: error,
      });
    }
    // return res.status(401).send({
    //   success: false,
    //   message: error?.message || "Invalid Access Token",
    //   data: error,
    // });
  }
};