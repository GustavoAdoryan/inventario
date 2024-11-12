import { Router } from 'express';
import { createTransaction, listTransactions } from '../controllers/transactionController';

const router = Router();

router.post('/transactions', createTransaction);
router.get('/transactions', listTransactions);

export default router;