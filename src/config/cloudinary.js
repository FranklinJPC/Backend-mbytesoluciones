import cloudinary from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({ 
    // llamada a las variables del archivo env
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});

const uploadImage = async (filepath) => {
    try {
        const res = await cloudinary.v2.uploader.upload(filepath, {folder: 'mbytes/productos'});
        return res;
    } catch (error) {
        console.log(error);
    }
}

const deleteImage = async (public_id) => {
    try {
        const res = await cloudinary.v2.uploader.destroy(public_id);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export {
    uploadImage,
    deleteImage
}