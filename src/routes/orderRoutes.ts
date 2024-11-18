import { Router } from 'express';
import {
    addOrderItem,
    createOrder,
    deleteOrder,
    getAllOrders,
    listOrderItems,
    removeOrderItem,
    updateOrder
} from '../controllers/orderController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Apenas Admin pode criar, atualizar e deletar pedidos
router.post('/orders', authenticateToken, authorizeAdmin, createOrder);
router.put('/orders/:id', authenticateToken, authorizeAdmin, updateOrder);
router.delete('/orders/:id', authenticateToken, authorizeAdmin, deleteOrder);

// Admin e Client podem visualizar pedidos e itens relacionados
router.get('/orders', authenticateToken, getAllOrders);
router.get('/orders/:orderId/items', authenticateToken, listOrderItems);

// Apenas Admin pode adicionar ou remover itens em pedidos
router.post('/orders/:orderId/items', authenticateToken, authorizeAdmin, addOrderItem);
router.delete('/orders/:id/items/:orderItemId', authenticateToken, authorizeAdmin, removeOrderItem);

export default router;
