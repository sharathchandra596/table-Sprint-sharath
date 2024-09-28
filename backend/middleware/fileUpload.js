import fileUpload from 'express-fileupload';

export const handleFileUpload = (req, res, next) => {
   try {
    if (!req.files || !req.files.image) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.image;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!validTypes.includes(file.mimetype)) {
        return res.status(400).send('Invalid file type. Only JPEG, PNG, and JPG are allowed.');
    }

    next();
   } catch (error) {
        console.log(error, "from handleFileUpload function")
   }
};


// middleware/fileUpload.js
// import cloudinary from 'cloudinary';
// import { v4 as uuidv4 } from 'uuid';

// export const handleFileUpload = async (req, res, next) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send('No files were uploaded.');
//     }

//     // Get the image file
//     const file = req.files.image;

//     // Only allow images
//     if (!file.mimetype.startsWith('image/')) {
//       return res.status(400).json({ message: 'Please upload an image file' });
//     }

//     // Upload to Cloudinary
//     const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
//       folder: 'category_images',
//       public_id: uuidv4(),
//     });

//     // Store the image URL in req.body
//     req.body.image = result.secure_url;

//     next();
//   } catch (err) {
//     res.status(500).json({ message: 'File upload failed', error: err.message });
//   }
// };
