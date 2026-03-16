
export async function uploadOnCloudinary(filePath) {
    try {
        if(!filePath) return null;

        const response = await cloudinary.uploader.upload(filePath , {
            resource_type : "auto"
        })

        console.log('file uploaded successfully!',response.url);
        return response;
   
    } catch (error) {
        fs.unlinkSync(filePath); //remove file from local server if file not upload in cloudinary
        console.log('error while uploading image on cloudinary',error);
    }
}