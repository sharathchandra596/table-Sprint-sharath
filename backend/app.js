import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import subcategoryRoutes from './routes/subcategory.js';
import productRoutes from './routes/productRoutes.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import 'dotenv/config'

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true })); 
app.use(cors("*"));


// Routes
app.use('/api/v1/user', userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/subcategory", subcategoryRoutes);
app.use('/api/v1/product', productRoutes);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
