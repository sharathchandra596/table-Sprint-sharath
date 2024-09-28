import express from 'express';

import { addSubcategory, deleteSubcategory, editSubcategory, getAllSubcategories } from '../controller/subcategoryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { handleFileUpload } from '../middleware/fileUpload.js';

const router = express.Router();

router.post('/addnew', authenticateToken, handleFileUpload, addSubcategory);  
router.get('/getall', getAllSubcategories);                                  
router.put('/edit/:id', authenticateToken,handleFileUpload, editSubcategory); 
router.delete('/delete/:id', authenticateToken, deleteSubcategory);   

export default router;
