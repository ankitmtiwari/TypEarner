
//Registration Controller
const registerUserController = async (req, res) => {
    console.log("came to register")
    res.render("auth/registration");
}


//Registration Controller
const loginUserController = async (req, res) => {
    console.log("came to login")
    res.render("auth/login");
}


export {
    registerUserController,
    loginUserController
};