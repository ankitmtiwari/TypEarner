import { configDotenv } from "dotenv";
import { userModel } from "../models/user_model.js";
import jwt from "jsonwebtoken";

const generateAuthTokens = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    //short term
    const accessToken = await user.createAccessToken();

    //short term
    user.accessToken = accessToken;
    user.isAcDeleted = false;
    user.isAcDeactivated = false;
    //save the updated data
    await user.save({ validateBeforeSave: false });

    return accessToken;
  } catch (error) {
    console.log("ERROR: Failed to create and store auth Token", error);
    // throw new ApiError(
    //   500,
    //   "Something went wrong while generating referesh and access token"
    // );
  }
};

// Get Registration Controller
const registerUserController = async (req, res) => {
  res.render("auth/registration");
};

// Do Registration Controller
const doRegisterUserController = async (req, res) => {
  const {
    regFirstName,
    regLastName,
    regEmail,
    regPhone,
    regPassword,
    regConfirmPassword,
  } = req.body;

  const [firstName, lastName, email, phoneNumber, password] = [
    regFirstName,
    regLastName,
    regEmail,
    regPhone,
    regPassword,
  ];
  //check if required fields are empty
  if (
    [regFirstName, regLastName, regEmail, regPhone, regPassword].some(
      (field) => field?.trim() === undefined || field?.trim() === ""
    )
  ) {
    return res.status(400).render("auth/registration", {
      success: false,
      message:
        "All Fields are required firstName,lastName, email, phoneNumber, password",
    });
  }

  // check if user already exists with email or username
  const existingUser = await userModel.findOne({
    $or: [{ phoneNumber }, { email }],
  });

  //error if user already exists
  if (existingUser) {
    return res.status(400).render("auth/registration", {
      success: false,
      message: "User Already Exists with given email or phone Number",
    });
  }
  if (regPassword === regConfirmPassword) {
    //create new user
    try {
      const user = await userModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        password: password,
        phoneNumber: phoneNumber,
      });

      //server error if user not created
      if (!user) {
        res.status(500).render("auth/registration", {
          success: false,
          message: "User not created",
          data: {},
        });
      }

      //get created users details from db except password
      const createdUser = await userModel
        .findById(user._id)
        .select("-password");

      //error if no user found
      if (!createdUser) {
        return res.status(500).send({
          success: false,
          message: "Something went wrong Try to login in",
        });
      }

      req.session.email = regEmail;
      return res.redirect(301, "login");
      // return res.status(201).send({
      //   success: true,
      //   message: "User Created Successfully",
      //   data: createdUser,
      // });
    } catch (error) {
      return res.status(400).render("auth/registration", {
        success: false,
        message: error.message,
        data: {},
      });
    }
  } else {
    res.render("auth/registration");
  }
};

//Get Login Controller
const loginUserController = async (req, res) => {
  const email = req.session.email || "";
  res.render("auth/login", { data: { email: email } });
};

//do the login
const doLoginUserController = async (req, res) => {
  const { email, password } = req.body;
  const phoneNumber = "";
  // const email = "";
  // const password = "1234";

  //check if atleast email or username is given
  if (!email) {
    return res.status(400).render("auth/lgin", {
      success: false,
      message: "Email is required",
      data: {},
    });
  }

  //check if user exists with given username or email
  const existingUser = await userModel.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  //error if no user found
  if (!existingUser) {
    return res.status(400).render("auth/login", {
      success: false,
      message: "User Does Not Exist with given email or phone Number",
      data: { email: email },
    });
  }

  //if password matches or not
  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  //error if password is invalid
  if (!isPasswordValid) {
    return res.status(401).render({
      success: false,
      message: "Invalid Credentials",
      data: { email: email },
    });
  }

  //generate  auth Token to keep the user logged in
  const accessToken = await generateAuthTokens(existingUser._id);

  //server error if unable to generate auth token
  if (!accessToken) {
    return res.status(500).render("auth/login", {
      success: false,
      // message: "Unable to generate auth token",   //to be donw when api call not frontend
      message: "Something went wrong please try later or contact us...",
      data: { email: email },
    });
  }

  // console.log("ACCESS TOKEN:", accessToken);
  //get the user details from db except passowrd
  const loggedInUser = await userModel
    .findById(existingUser._id)
    .select("-password -accessToken");

  //cofigure options for storing token in browser cookier of the user
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Redirect the user to the originally requested page, or default to the dashboard
  const redirectTo = req.session.returnTo || "/";
  console.log("Return to", redirectTo);
  delete req.session.returnTo; // Clear session once redirected
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .redirect(redirectTo);
};

//do Log OUt Controller
const doLogoutController = async (req, res) => {
  //cofigure options for storing token in browser cookier of the user
  const options = {
    httpOnly: true,
    secure: true,
  };
  delete req.session.returnTo; // Clear session once logged out
  return res.status(200).clearCookie("accessToken", options).redirect("/");
};

// const homePageController = async (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     res.render("task/index", { success: true });
//   } else {
//     const currentUser = jwt.verify(
//       accessToken,
//       process.env.ACCESS_TOKEN_SECRET
//     );
//     const { _id, email, firstName, lastName } = currentUser;
//     res.status(200).render("task/index", {
//       success: true,
//       data: { firstName: firstName, lastName: lastName, email: email },
//     });
//   }
// };

const homePageController = async (req, res) => {
  console.log("came to home page");
  //If user is logged in then access_token cookie will be there
  if (req.cookies.accessToken) {
    //cofigure options for storing token in browser cookier of the user
    const options = {
      httpOnly: true,
      secure: true,
    };
    console.log("Cookie means access token found and user");
    const accessToken = req.cookies.accessToken;
    try {
      //if access token is available then verify that if its expired or not
      const currentUser = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      //if no curreny User found then force to login again
      if (!currentUser) {
        return res
          .status(400)
          .clearCookie("accessToken", options)
          .render("auth/login", {
            success: false,
            message: "Invalid Session. Please Login again",
          });
      }
      //if token is verified then
      const { _id, email, firstName, lastName } = currentUser;
      return res.status(200).render("task/index", {
        success: true,
        data: { firstName: firstName, lastName: lastName, email: email },
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .clearCookie("accessToken", options)
          .render("auth/login", {
            success: false,
            message: "Session expired. Please log in again.",
            data: {},
          });
      } else {
        return res
          .status(401)
          .clearCookie("accessToken", options)
          .send({
            success: false,
            message: error?.message || "Invalid access token",
            data: error,
          });
      }
    }
  } else {
    console.log("User not found in request");
    res.render("task/index", { success: true });
  }
};

const dashBoardController = async (req, res) => {
  res.status(200).render("task/dashboard");
};

export {
  registerUserController,
  doRegisterUserController,
  loginUserController,
  doLoginUserController,
  doLogoutController,
  homePageController,
  dashBoardController,
};
