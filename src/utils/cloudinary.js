import {v2 as cloudinary} from "cloudinary"

import fs from "fs" // node js mai byDefalut ye library aata hai isko import install nai lrna padta hai

// fs ko always link unlink krte hai delete nai hota hai fs 


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null

        // upload the file on cloudinary

       const response =  await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" // mens audio video imges or auto
        })
         console.log("response=>",response)
         
        // file has been uploaded successfully

       // console.log("file is uploaded on cloudinary",response.url)
        fs.unlinkSync(localFilePath)
        return response;
    }catch(err){
        // aur synchronously remove kro
        fs.unlinkSync(localFilePath)// reome the locally saved temoprary file as upload the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}

