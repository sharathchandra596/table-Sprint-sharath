import db from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

// Add new subcategory
export const addSubcategory = async (req, res) => {
    const { subcategory_name, category, sequence, status } = req.body;

    try {
        if(!subcategory_name || !category  || !sequence) {
            return res.status(400).send('All fields are required');
        }
        const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
            folder: 'subcategories',
        });

        const imageUrl = result.secure_url;

        const query = 'INSERT INTO subcategories (subcategory_name, category, image, sequence, status) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [subcategory_name, category, imageUrl, sequence, status || 'active'], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send('Subcategory added successfully');
        });
    } catch (error) {
        console.log(error, "from addSubcategory function")
        res.status(500).send(error);
    }
};

// Get all subcategories
export const getAllSubcategories = (req, res) => {
  try {
    const query = 'SELECT * FROM subcategories';

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
  } catch (error) {
    console.log(error, "from getAllSubcategories function")
  }
};

// Edit a subcategory by id
export const editSubcategory = async (req, res) => {
    const { subcategory_name, category, sequence, status } = req.body;
    const { id } = req.params;

    try {
        let imageUrl;

        // Check if a new image is provided in the request
        if (req.files && req.files.image) {
            const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
                folder: 'subcategories',
            });
            imageUrl = result.secure_url;
        } else {
            
            const [existingSubcategory] = await db.promise().query('SELECT image FROM subcategories WHERE id = ?', [id]);
            imageUrl = existingSubcategory[0]?.image;
        }

        // Update subcategory with or without a new image
        const query = 'UPDATE subcategories SET subcategory_name = ?, category = ?, image = ?, sequence = ?, status = ? WHERE id = ?';
        db.query(query, [subcategory_name, category, imageUrl, sequence, status, id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send('Subcategory updated successfully');
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Delete a subcategory by id
export const deleteSubcategory = (req, res) => {
    try {
        const { id } = req.params;
    const query = 'DELETE FROM subcategories WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Subcategory deleted successfully');
    });
    } catch (error) {
        console.log(error, "from deleteSubcategory function")
    }
};
