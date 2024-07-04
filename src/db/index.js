import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );

    console.log(`DB NAME: ${connectionInstance.connection.name}`);
    console.log(`DB USER: ${connectionInstance.connection.user}`);
    console.log(`DB PORT: ${connectionInstance.connection.port}`);
    console.log(
      `Connection State: ${connectionInstance.connection.readyState}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
