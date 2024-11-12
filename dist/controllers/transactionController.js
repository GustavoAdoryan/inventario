"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactions = exports.createTransaction = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const sequelize_1 = require("sequelize");
const createTransaction = async (req, res) => {
    const { productId, quantity, transactionType, transactionDate, orderId } = req.body;
    try {
        const order = await Order_1.default.findByPk(orderId);
        if (!order) {
            res.status(404).json({ error: 'Pedido não encontrado' });
            return;
        }
        const product = await Product_1.default.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        const transaction = await Transaction_1.default.create({
            productId,
            quantity,
            transactionType,
            transactionDate,
            orderId,
        });
        if (transactionType === 'entrada') {
            product.stock += quantity;
        }
        else if (transactionType === 'saída') {
            product.stock -= quantity;
        }
        await product.save();
        res.status(201).json({
            message: 'Transação registrada com sucesso',
            transaction,
            updatedStock: product.stock,
        });
    }
    catch (error) {
        console.error('Erro ao criar transação:', error);
        res.status(500).json({ error: 'Erro ao criar a transação' });
    }
};
exports.createTransaction = createTransaction;
const listTransactions = async (req, res) => {
    const { transactionType, startDate, endDate } = req.query;
    try {
        const where = {};
        if (transactionType) {
            where.transactionType = transactionType;
        }
        if (startDate || endDate) {
            where.transactionDate = {};
            if (startDate) {
                where.transactionDate[sequelize_1.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                where.transactionDate[sequelize_1.Op.lte] = new Date(endDate);
            }
        }
        const transactions = await Transaction_1.default.findAll({
            where,
            include: [{ model: Product_1.default, as: 'product' }],
            order: [['transactionDate', 'DESC']],
        });
        res.status(200).json({ transactions });
    }
    catch (error) {
        console.error('Erro ao listar transações:', error);
        res.status(500).json({ error: 'Erro ao listar transações' });
    }
};
exports.listTransactions = listTransactions;
