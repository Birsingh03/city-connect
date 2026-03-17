import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";

config({ path: './.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadOnCloudinary(filePath) {
    try {
        if(!filePath) return null;

        const response = await cloudinary.uploader.upload(filePath , {
            resource_type : "auto",
            folder: "issue_reports"
        });

        console.log('file uploaded successfully!',response.url);
        return response;
   
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.log('error while uploading image on cloudinary',error);
        return null;
    }
}
