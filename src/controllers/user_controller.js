
//Registration Controller
const registerUserController = async (req, res) => {
    console.log("came to register")
    res.render("auth/login");
}


export {
    registerUserController
};