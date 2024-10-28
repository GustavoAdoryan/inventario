import { Router } from "express";
import { createClient, getAllClients, updateClient } from "../controllers/clientController";


const router = Router();

router.post('/client', createClient);
router.get('/client', getAllClients);
router.put('/client/:id', updateClient)


export default router;