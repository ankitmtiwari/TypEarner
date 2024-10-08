import { paraTextModel } from "../models/paraText_model.js";

async function getRandomParaText(category) {
  const match = {};
  if (typeof category !== undefined && category != null) {
    match.category = category;
  }
  try {
    // Use aggregation to randomly get one document
    const randomPara = await paraTextModel
      .aggregate([{ $match: match }, { $sample: { size: 1 } }])
      .catch((error) => {
        console.log("No got text");
        throw error;
      });
    if (randomPara.length > 0) {
      return randomPara[0]; // Since $sample returns an array, return the first (and only) item
    } else {
      return null; // In case there are no documents in the collection
    }
  } catch (error) {
    console.error("Error fetching random paraText:", error);
    throw error; // Handle or log the error as per your requirement
  }
}

const typingTaskController = async (req, res) => {
  if (!req.user) {
    const { level } = req.params;
    if (
      level === "beginer" ||
      level === "intermidiate" ||
      level === "advance" ||
      level === "cool"
    ) {
      try {
        const doc = await getRandomParaText(level);
        if (doc != null) {
          return res.status(200).render("task/typing_task", {
            paratext: doc.paraText,
          });
        } else {
          return res.status(404).send({ error: "No matcging records" });
        }
      } catch (error) {
        return res.status(500).send({ error: error });
      }
    } else {
      return res.status(404).render("task/index");
    }
  } else {
    //cofigure options for storing token in browser cookier of the user
    const options = {
      httpOnly: true,
      secure: true,
    };
    req.session.returnTo = req.originalUrl;
    return res
      .status(301)
      .clearCookie("accessToken", options)
      .render("auth/login", {
        success: false,
        message: "Unauthorised request Please log in Suspecius Detected",
        data: {},
      });
  }
};

const demoTypingTaskController = async (req, res) => {
  const { level } = req.params;
  if (
    level === "beginer" ||
    level === "intermidiate" ||
    level === "advance" ||
    level === "cool"
  ) {
    try {
      const doc = await getRandomParaText(level);
      if (doc != null) {
        return res.status(200).render("task/typing_task", {
          paratext: doc.paraText,
        });
      } else {
        return res.status(404).send({ error: "No matching records" });
      }
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  } else {
    const doc = await getRandomParaText();
    return res.status(200).render("task/demo_task", { paratext: doc.paraText });
  }
};

const taskSubmissionController = async (req, res) => {
  console.log("Came to submit task");
  //use some verificaion to kniw the genuine request
};
export {
  typingTaskController,
  demoTypingTaskController,
  taskSubmissionController,
};
