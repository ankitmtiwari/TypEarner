import { paraTextModel } from "../models/paraText_model.js";

// Array of quotes
const quotes = [
  {
    paraText:
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    category: "beginer",
    wordCount: 16,
  },
  {
    paraText: "The purpose of our lives is to be happy.",
    category: "beginer",
    wordCount: 8,
  },
  {
    paraText: "Life is what happens when you're busy making other plans.",
    category: "beginer",
    wordCount: 10,
  },
  {
    paraText:
      "Success usually comes to those who are too busy to be looking for it. Stay focused, work hard, and never give up on your dreams, no matter how big or small.",
    category: "intermidiate",
    wordCount: 27,
  },
  {
    paraText:
      "The only way to do great work is to love what you do. If you haven’t found it yet, keep looking. Don’t settle. Stay hungry, stay foolish.",
    category: "intermidiate",
    wordCount: 27,
  },
  {
    paraText:
      "Don’t let yesterday take up too much of today. The more you sweat in practice, the less you bleed in battle.",
    category: "intermidiate",
    wordCount: 22,
  },
  {
    paraText:
      "Do not go where the path may lead, go instead where there is no path and leave a trail. Life is too short to be living somebody else’s dream, so follow your own path and make your own destiny.",
    category: "advance",
    wordCount: 39,
  },
  {
    paraText:
      "Success is not about the destination, it's about the journey. It's about the effort you put in each day, the small steps that lead to big results, and the lessons learned along the way. Keep pushing forward.",
    category: "advance",
    wordCount: 41,
  },
  {
    paraText:
      "The greatest glory in living lies not in never falling, but in rising every time we fall. Our biggest fear is not in failure but in failing to try again after falling down.",
    category: "advance",
    wordCount: 38,
  },
];

const inserTextController = async (req, res) => {
  try {
    const text=await paraTextModel.insertMany(quotes).then((suc)=>{
        return res.status(201).send("Text inserted successfully")
    }).catch((er)=>{
        return res.status(500).send({message:"Failed to inser texts", error:"Insert Failed", data:er});
    });
  } catch (error) {
    console.log("Error inserting quotes:", error);
  }
};

export {inserTextController}