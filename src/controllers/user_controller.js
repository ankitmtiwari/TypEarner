import { userModel } from "../models/user_model.js";

// Get Registration Controller
const registerUserController = async (req, res) => {
  console.log("came to register view");
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
    return res.status(400).render('auth/registration', {
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
        res
          .status(500)
          .render('auth/registration', { success: false, message: "User not created", data: {} });
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
      return res.status(400).render('auth/registration', {
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
  console.log("came to login");
  const email = req.session.email || "";

  res.render("auth/login", { email: email });
};

//do the login
const doLoginUserController=  = async (req, res) => {
  const { userName, email, password } = req.body;
  // const userName = "ankittiwari";
  // const email = "";
  // const password = "1234";

  //check if atleast email or username is given
  if (!userName && !email) {
    return res.status(400).send({
      success: false,
      message: "Username Or Email is required",
      data: {},
    });
  }

  //check if user exists with given username or email
  const existingUser = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  //error if no user found
  if (!existingUser) {
    return res.status(400).send({
      success: false,
      message: "User Does Not Exist with email or username",
      data: {},
    });
  }

  //if password matches or not
  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  //error if password is invalid
  if (!isPasswordValid) {
    return res
      .status(401)
      .send({ success: false, message: "Invalid Credentials", data: {} });
  }

  //generate  auth Token to keep the user logged in
  const { accessToken, refreshToken } = await generateAuthTokens(
    existingUser._id
  );

  //server error if unable to generate auth token
  if (!accessToken || !refreshToken) {
    return res.status(500).send({
      success: false,
      message: "Unable to generate auth token",
      data: {},
    });
  }

  // console.log("ACCESS TOKEN:", accessToken);
  //get the user details from db except passowrd
  const loggedInUser = await userModel
    .findById(existingUser._id)
    .select("-password -accessToken -refreshToken");

  //cofigure options for storing token in browser cookier of the user
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send({
      success: true,
      message: "Login Successfull",
      data: { user: loggedInUser, accessToken, refreshToken },
    });

    
const homePageController = async (req, res) => {
  console.log("came to login");
  res.render("task/index");
};

export {
  registerUserController,
  doRegisterUserController,
  loginUserController,
  homePageController,
};
