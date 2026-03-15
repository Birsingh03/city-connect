import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected!! DB Host: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.log("MONGODB connection error: ", error);
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;