import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Registro e login de usuários
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rota protegida de exemplo para Admin
router.get('/protected', authenticateToken, authorizeAdmin, (req, res) => {
    res.status(200).json({ message: 'Acesso permitido. Você é Admin.' });
});

export default router;
