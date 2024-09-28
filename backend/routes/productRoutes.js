import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { addProduct, deleteProduct, editProduct, getAllProducts } from '../controller/productController.js';
import { handleFileUpload } from '../middleware/fileUpload.js';



const router = express.Router();



router.post('/addnew', /*authenticateToken*/ handleFileUpload, addProduct);  
router.get('/getall', getAllProducts);                                   
router.put('/edit/:id', /*authenticateToken*/ handleFileUpload, editProduct); 
router.delete('/delete/:id', /*authenticateToken*/ deleteProduct);  

export default router;
