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
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10); // here 10 rounds
//   next();
// });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// coustom methods of moongoose

userSchema.methods.isPasswordCorrect = async function (password) {
  
  console.log('Password:----------------', password);
  console.log('Hashed Password:--------------', this.password);
  return await bcrypt.compare(password, this.password);
};

// Token------------------------------------------
// Access token time limit is short aur short duration mai expire hogaa ...
// refreshToken(session storage) time limit is long aur long duration mai expire hogaa ...

/* refresh token DB aur user dono kai pss
 hota hai user ko access token hi diya 
jata hai par har baar validate(every tyme password dalo nkko) nai kro appka refreshtoken
 aur data base refresh token same hua toh new access
  token de diya jata hai */

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
