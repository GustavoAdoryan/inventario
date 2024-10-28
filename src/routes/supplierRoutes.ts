import { Router } from 'express';
import { createSupplier, updateSupplier, deleteSupplier, getlAllSupplier } from '../controllers/supplierController';

const router = Router();

router.post('/suppliers', createSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);
router.get('/suppliers',getlAllSupplier);

export default router;