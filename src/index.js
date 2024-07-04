//require('dotenv').config({path:'./.env'}) You can used insted of import

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;
//  /*asyn method jab bhi complete
//   hota hai toh woh promise return
// krta hai isliye yaha par .then() used kiya gya hai*/
connectDB() // here calling the connectDB() for database connection
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is Running at${port}`);
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection Failed", err);
  });




















































  

//--->> ## First approach to connect to  database

// import express from "express"
// const app = express()

// (async()=>{
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//        app.on("error",(error)=>{
//         console.log("ERR=>",error)
//         throw error
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT}`)
//        })
//     }
//     catch(error){
//         console.error("ERROR : ",error.message)
//         throw error
//     }
// })()
