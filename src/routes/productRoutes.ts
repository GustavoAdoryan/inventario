import { Router } from 'express';
import {
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct
} from '../controllers/productController';
import upload from '../middlewares/uploadMiddleware';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Apenas Admin pode criar, atualizar e deletar produtos
router.post('/products', authenticateToken, authorizeAdmin, upload.single('image'), createProduct);
router.put('/products/:id', authenticateToken, authorizeAdmin, upload.single('image'), updateProduct);
router.delete('/products/:id', authenticateToken, authorizeAdmin, deleteProduct);

// Admin e Client podem visualizar a lista de produtos
router.get('/products', authenticateToken, getAllProducts);

export default router;
