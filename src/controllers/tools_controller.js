//Registration Controller
const textCaseController = async (req, res) => {
    console.log("came to text case convertor")
    res.render("tools/text_case");
}

const typingSpeedController = async (req, res) => {
    console.log("came to text case convertor")
    res.render("tools/typing_speed");
}

export {
    textCaseController,
    typingSpeedController
};