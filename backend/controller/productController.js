import db from '../config/db.js';


import cloudinary from '../config/cloudinary.js';


export const addProduct = async (req, res) => {
    const { product_name, category, subcategory, sequence, status } = req.body;

    try {
        if (!product_name || !category || !subcategory  || !sequence) {
            return res.status(400).send('All fields are required');
        }
        const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
            folder: 'products',
        });

        const imageUrl = result.secure_url;

        const query = 'INSERT INTO products (product_name, category, subcategory, image, sequence, status) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [product_name, category, subcategory, imageUrl, sequence, status || 'active'], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send('Product added successfully');
        });
    } catch (error) {
        console.log(error, "from addProduct function")
        res.status(500).send(error);
    }
};


// Get all products 
export const getAllProducts = (req, res) => {
    try {
        const query = 'SELECT * FROM products';

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
    } catch (error) {
        console.log(error, "from getAllProducts function")
    }
};

// Edit a product by id
export const editProduct = async (req, res) => {
    const { product_name, category, subcategory, sequence, status } = req.body;
    const { id } = req.params;

    try {
        let imageUrl;

        // Check if a new image is provided in the request
        if (req.files && req.files.image) {
            const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
                folder: 'products',
            });
            imageUrl = result.secure_url;
        } else {
            // Fetch the existing image URL from the database if no new image is uploaded
            const [existingProduct] = await db.promise().query('SELECT image FROM products WHERE id = ?', [id]);
            imageUrl = existingProduct[0]?.image;
        }

        // Update product with or without a new image
        const query = 'UPDATE products SET product_name = ?, category = ?, subcategory = ?, image = ?, sequence = ?, status = ? WHERE id = ?';
        db.query(query, [product_name, category, subcategory, imageUrl, sequence, status, id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send('Product updated successfully');
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Delete a product by id
export const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Product deleted successfully');
    });
  } catch (error) {
    console.log(error, "from deleteProduct function")
  }
};
