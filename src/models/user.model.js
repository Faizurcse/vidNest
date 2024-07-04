// it is totally schema structure
// cloudnary is service provider sdk ek aisa palform jhaa se video files imges ko esily hendle kar skte hai uplod krna
// big companies imges videos ko yaha rakhta hai

// expressFileUpload,Multer

// MUlter == Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.


// here we are going to two step verfication  setting best practices

// first multer ka use krte hue file ko temporary local storage server par rkho
// secondly cloundry ka use krte hue local storge se file ko  server par dalo
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // explore it
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url=>like aws
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// when pwd is changegs its encrypt the data pwd then store in DB
// Mongoose middleware function for hashing a password before saving
//middleware is nothing but koi bhi work krne se pahle milkr jana ass mems
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10); // here 10 rounds
  next();
});

// coustom methods of moongoose

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// acces token aur refresh token ko generate karne ka method both are jwt tokens

// explore why not used arrow fn insted of function()

// fullName-payload name , this.fullName-its come from DB

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// all are same as accessToken but diff. is information km hota hai
// only id rakhte hai isliye (uses baad mai disscuss krenge)

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

