import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, "first name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      require: [true, "last name is required"],
      trim: true,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      require: [true, "Phone number is required"],
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    accessToken: {
      type: String,
    },
    isAcDeleted: {
      type: Boolean,
      default: false,
    },
    isAcDeactivated: {
      type: Boolean,
      default: false,
    },
    point: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

//to check every time userSchema is saving something if password is changed or not
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//check if the given password matches with the stored password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//short term token like short sessions to
userSchema.methods.createAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName:this.lastName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    }
  );
};

export const userModel = mongoose.model("User", userSchema);
