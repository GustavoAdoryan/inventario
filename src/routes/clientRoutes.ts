import { Router } from "express";
import {
    createClient,
    deleteClient,
    getAllClients,
    updateClient
} from "../controllers/clientController";
import { authenticateToken, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Apenas Admin pode criar, atualizar e deletar clientes
router.post('/clients', authenticateToken, authorizeAdmin, createClient);
router.put('/clients/:id', authenticateToken, authorizeAdmin, updateClient);
router.delete('/clients/:id', authenticateToken, authorizeAdmin, deleteClient);

// Admin e Client podem visualizar a lista de clientes
router.get('/clients', authenticateToken, getAllClients);

export default router;
