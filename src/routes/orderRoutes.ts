import { Router } from 'express';
import { createOrder, getAllOrders, updateOrder, deleteOrder, listOrderItems, addOrderItem, removeOrderItem } from '../controllers/orderController';

const router = Router();

router.post('/orders', createOrder);

router.get('/orders', getAllOrders);
router.get('/orders/:orderId/items', listOrderItems);

router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

router.post('/orders/:orderId/items', addOrderItem);
router.delete('/orders/:id/items/:orderItemId', removeOrderItem);

export default router;