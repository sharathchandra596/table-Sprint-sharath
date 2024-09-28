import db from '../config/db.js';
import cloudinary from '../config/cloudinary.js';


export const addCategory = async (req, res) => {
    

    try {
        const { category_name, sequence, status } = req.body;
        if (!category_name || !sequence) {
            return res.status(400).send('All fields are required');
        }
        const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
            folder: 'categories',
        });

        const imageUrl = result.secure_url;

        const query = 'INSERT INTO categories (category_name, image, sequence, status) VALUES (?, ?, ?, ?)';
        db.query(query, [category_name, imageUrl, sequence, status || 'active'], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send('Category added successfully');
        });
    } catch (error) {
        console.log(error, "from addCategory function");
        res.status(500).send(error);
    }
};
// controller/categoryController.js
// export const addCategory = async (req, res) => {
//     try {
//       const { category_name, sequence, status } = req.body;
  
//       // Image URL is now in req.body.image (from the file upload middleware)
//       const imageUrl = req.body.image;
  
//       const category = await Category.create({
//         category_name,
//         image: imageUrl,  // Assigning the uploaded image URL to the category
//         sequence,
//         status
//       });
  
//       res.status(201).json({
//         success: true,
//         data: category,
//       });
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating category', error: error.message });
//     }
//   };
  

export const getAllCategories = (req, res) => {
    const query = 'SELECT * FROM categories';

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

export const editCategory = async (req, res) => {
    const { category_name, sequence, status } = req.body;
    const { id } = req.params;

    try {
        let imageUrl;

        // Check if a new image is provided in the request
        if (req.files && req.files.image) {
            const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
                folder: 'categories',
            });
            imageUrl = result.secure_url;
        } else {
            // Fetch the existing image URL from the database if no new image is uploaded
            const [existingCategory] = await db.promise().query('SELECT image FROM categories WHERE id = ?', [id]);
            imageUrl = existingCategory[0]?.image;
        }

        // Update category with or without a new image
        const query = 'UPDATE categories SET category_name = ?, image = ?, sequence = ?, status = ? WHERE id = ?';
        db.query(query, [category_name, imageUrl, sequence, status, id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send('Category updated successfully');
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteCategory = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM categories WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Category deleted successfully');
    });
};
