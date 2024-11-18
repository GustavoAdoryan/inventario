import { Router } from 'express';
import {
    createTransaction,
    listTransactions
} from '../controllers/transactionController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Apenas Admin pode criar transações
router.post('/transactions', authenticateToken, authorizeAdmin, createTransaction);

// Admin e Client podem visualizar transações
router.get('/transactions', authenticateToken, listTransactions);

export default router;
