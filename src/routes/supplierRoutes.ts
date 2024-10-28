import { Router } from 'express';
import { createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController';

const router = Router();

router.post('/suppliers', createSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

export default router;