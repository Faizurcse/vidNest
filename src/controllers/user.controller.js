import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// its is the higher order function
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message: "code with faiz 01"
  // })

  // steps-----------------------------------------

  // for register user taking data fom frontend
  // validation - not empty
  // check if user already exists : user,email
  // check for images, check for avatar
  // upload them to cludinary, avtar
  //create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  // taking data from frontEnd
  const { fullName, email, username, password } = req.body;
  console.log("req.body=>", req.body);
  console.log(fullName);
  console.log(username);
  console.log(email);
  console.log(password);

  // validation
  //field hai toh trim kro trim kai baad bhi null hai toh return true
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  console.log("existedUser", existedUser);

  // check for images, check for avatar
  console.log("req.files=>", req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath =  req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them to cludinary, avtar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //   let coverImage;
  //    if(coverImageLocalPath!==undefined)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  //create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token field from response

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken" // here removing both syntx
  );

  //check for user creation

  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User regestered successfully"));
});



export { registerUser };
