import mongoose from "mongoose";


const paraTextSchema = new mongoose.Schema(
  {
    paraText: {
      type: String,
      require: [true, "para Text is required"],
      trim: true,
    },
    wordCount: {
      type: Number,
      require: [true, "word count is required"],
    },
    category: {
      type: String,
      enum: ["beginer", "intermidiate", "advance", "cool"],
      default: "intermediate",
      require: [true, "category is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export const paraTextModel = mongoose.model("ParaText", paraTextSchema);
