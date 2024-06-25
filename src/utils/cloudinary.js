import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadCloudinary = async (localfilepath) => {
    try{
        if (!localfilepath) return null
        const resp = await cloudinary.uploader.upload(
            localfilepath, {
                resource_type: "auto"
            })
            console.log('file has been uploaded',resp.url)
            return resp;
    }catch(error){
        fs.unlinkSync(localfilepath)
    }
}

export { uploadCloudinary }