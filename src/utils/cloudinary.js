import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: 'dwflmkssm', 
    api_key: '147193313958721', 
    api_secret: 'VxnQJU-Z_9iYq6F1IdpwOcxjpx0'
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