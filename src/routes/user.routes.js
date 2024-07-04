import {Router} from "express"
import {registerUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router()

// /register-->routes , registerUser-->methods

router.route("/register").post(
    upload.fields([ // here upload=> connecting or injecting  middleware...
        {
            name: "avatar",
            maxCount: 1// means how many avtar can load
        },
        {
            name: "coverImage",
            maxCount: 1 // means how many images can load
        }
    ]),
    registerUser)
  
export default router