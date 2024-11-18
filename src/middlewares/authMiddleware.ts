import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Definimos um tipo específico para Requests que contêm `user`
interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.error('Nenhum token fornecido.');
        res.status(401).json({ message: 'Token não fornecido.' });
        return;
    }

    console.log('Token recebido:', token);
    console.log('Segredo usado na validação:', process.env.JWT_SECRET);

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            console.error('Erro ao validar token:', err.message); // Log do erro
            res.status(403).json({ message: 'Token inválido.' });
            return;
        }

        console.log('Token decodificado com sucesso:', decoded); // Log do token decodificado
        req.user = decoded as JwtPayload; // Adiciona o payload no request
        next();
    });
};


export const authorizeAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user || (req.user as JwtPayload).tipo_user !== 'Admin') {
        res.status(403).json({ message: 'Acesso negado. Apenas Admins podem acessar esta rota.' });
        return;
    }
    next();
};

export const authorizeClient = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user || (req.user as JwtPayload).tipo_user !== 'Client') {
        res.status(403).json({ message: 'Acesso negado. Apenas Clientes podem acessar esta rota.' });
        return;
    }
    next();
};