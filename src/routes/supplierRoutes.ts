import { Router } from 'express';
import {
    createSupplier,
    deleteSupplier,
    getlAllSupplier,
    updateSupplier
} from '../controllers/supplierController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Apenas Admin pode criar, atualizar e deletar fornecedores
router.post('/suppliers', authenticateToken, authorizeAdmin, createSupplier);
router.put('/suppliers/:id', authenticateToken, authorizeAdmin, updateSupplier);
router.delete('/suppliers/:id', authenticateToken, authorizeAdmin, deleteSupplier);

// Admin e Client podem visualizar fornecedores
router.get('/suppliers', authenticateToken, getlAllSupplier);

export default router;
