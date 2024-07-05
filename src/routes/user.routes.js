import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// /register-->routes , registerUser-->methods

router.route("/register").post(
  upload.fields([
    // here upload=> connecting or injecting  middleware...
    {
      name: "avatar",
      maxCount: 1, // means how many avtar can load
    },
    {
      name: "coverImage",
      maxCount: 1, // means how many images can load
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT,logoutUser)

export default router;
