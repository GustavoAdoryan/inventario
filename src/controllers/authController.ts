import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Client from '../models/Client'; // Importe o modelo de Client
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, tipo_user, cpf_cnpj, contact, address } = req.body;

        // Validação básica
        if (!name || !email || !password || !tipo_user) {
            res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
            return;
        }

        // Validação específica para "Client"
        if (tipo_user === 'Client' && (!cpf_cnpj || !contact || !address)) {
            res.status(400).json({ message: 'CPF/CNPJ, contato e endereço são obrigatórios para clientes.' });
            return;
        }

        // Verificar duplicidade no User
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email já cadastrado.' });
            return;
        }

        // Verificar duplicidade no Client
        if (tipo_user === 'Client') {
            const existingClient = await Client.findOne({
                where: {
                    [Op.or]: [{ cpf_cnpj }, { contact }],
                },
            });

            if (existingClient) {
                const field = existingClient.cpf_cnpj === cpf_cnpj ? 'CPF/CNPJ' : 'Contato';
                res.status(400).json({ message: `${field} já cadastrado.` });
                return;
            }
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            tipo_user,
        });

        // Se for "Client", criar na tabela `Clients`
        if (tipo_user === 'Client') {
            await Client.create({
                name,
                email,
                cpf_cnpj,
                contact,
                address,
                userId: user.id,
            });
        }
        

        res.status(201).json({ message: 'Usuário registrado com sucesso!', user });
    } catch (error) {
        console.error(error);
        next(error); // Encaminhar o erro para o middleware de erro
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Email ou senha inválidos.' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Email ou senha inválidos.' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, tipo_user: user.tipo_user },
            process.env.JWT_SECRET as string, // Deve ser igual nos dois casos
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login bem-sucedido.',
            token,
            user: { id: user.id, name: user.name, email: user.email, tipo_user: user.tipo_user },
        });
    } catch (error) {
        next(error); // Envia para o middleware de erro
    }
};
