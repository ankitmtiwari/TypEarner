
//Registration Controller
const registerUserController = async (req, res) => {
    console.log("came to register view")
    res.render("auth/registration");
}

//Registration Controller
const doRegisterUserController = async (req, res) => {
    const {regEmail, regPassword, regConfirmPassword}= req.body;
    console.log(regEmail, regPassword, regConfirmPassword)
    if(regPassword === regConfirmPassword)
    {
        req.session.email=regEmail;
        req.session.password=regConfirmPassword;

        res.redirect(301, 'login')
    }
    else{
        res.render("auth/registration");
    }
}

//Registration Controller
const loginUserController = async (req, res) => {
    console.log("came to login")
    const email= req.session.email;
    const password=req.session.password;

    res.render("auth/login", {"email":email, "password":password});
}

const homePageController= async (req, res) => {
    console.log("came to login")
    res.render("task/index");
}

export {
    registerUserController,
    doRegisterUserController,
    loginUserController,
    homePageController
};