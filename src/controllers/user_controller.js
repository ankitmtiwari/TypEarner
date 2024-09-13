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

  //check if required fields are empty
  if (
    [regFirstName, regLastName, regEmail, regPhone, regPassword].some(
      (field) => field?.trim() === undefined || field?.trim() === ""
    )
  ) {
    return res.status(400).render( "auth/registration", {
      success: false,
      message:
        "All Fields are required firstName,lastName, email, phoneNumber, password",
    });
  }
  if (regPassword === regConfirmPassword) {
    console.log(
      regFirstName,
      regLastName,
      regEmail,
      regPassword,
      regConfirmPassword
    );
    req.session.email = regEmail;

    res.redirect(301, "login");
  } else {
    res.render("auth/registration", );
  }
};

//Get Login Controller
const loginUserController = async (req, res) => {
  console.log("came to login");
  const email = req.session.email||'';

  res.render("auth/login", { email: email});
};

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
