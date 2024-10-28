import { Router } from 'express';
import { getAllProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController';
import upload from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/products', getAllProducts);
router.post('/products', upload.single('image'), createProduct);

router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;