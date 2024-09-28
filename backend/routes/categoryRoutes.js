import express from 'express';
import { addCategory, deleteCategory, editCategory, getAllCategories } from '../controller/categoryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { handleFileUpload } from '../middleware/fileUpload.js';


const router = express.Router();

router.post('/addnew', /*authenticateToken*/handleFileUpload, addCategory);  
router.get('/getall', getAllCategories);                                   
router.put('/edit/:id', /*authenticateToken*/handleFileUpload, editCategory); 
router.delete('/delete/:id', /*authenticateToken*/deleteCategory);   
// authenticateToken
export default router