import { Router } from "express";
import { createClient, deleteClient, getAllClients, updateClient } from "../controllers/clientController";


const router = Router();

router.post('/clients', createClient);
router.get('/clients', getAllClients);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);


export default router;