import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Product from '../models/Product';
import Order from '../models/Order';
import { Op } from 'sequelize';

export const createTransaction = async (req: Request, res: Response) => {
    const { productId, quantity, transactionType, transactionDate, orderId } = req.body;

    try {

        const order = await Order.findByPk(orderId);
        if (!order) {
            res.status(404).json({ error: 'Pedido não encontrado' });
            return;
        }


        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }


        const transaction = await Transaction.create({
            productId,
            quantity,
            transactionType,
            transactionDate,
            orderId,
        });


        if (transactionType === 'entrada') {
            product.stock += quantity;
        } else if (transactionType === 'saída') {
            product.stock -= quantity;
        }


        await product.save();


        res.status(201).json({
            message: 'Transação registrada com sucesso',
            transaction,
            updatedStock: product.stock,
        });
    } catch (error) {
        console.error('Erro ao criar transação:', error);
        res.status(500).json({ error: 'Erro ao criar a transação' });
    }
};

export const listTransactions = async (req: Request, res: Response) => {
    const { transactionType, startDate, endDate } = req.query;

    try {
        const where: any = {};

        if (transactionType) {
            where.transactionType = transactionType;
        }

        if (startDate || endDate) {
            where.transactionDate = {};
            if (startDate) {
                where.transactionDate[Op.gte] = new Date(startDate as string);
            }
            if (endDate) {
                where.transactionDate[Op.lte] = new Date(endDate as string);
            }
        }

        const transactions = await Transaction.findAll({
            where,
            include: [{ model: Product, as: 'product' }],
            order: [['transactionDate', 'DESC']],
        });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Erro ao listar transações:', error);
        res.status(500).json({ error: 'Erro ao listar transações' });
    }
};