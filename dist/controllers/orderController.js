"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOrderItem = exports.addOrderItem = exports.listOrderItems = exports.deleteOrder = exports.updateOrder = exports.getAllOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const OrderItem_1 = __importDefault(require("../models/OrderItem"));
const Product_1 = __importDefault(require("../models/Product"));
const Client_1 = require("../models/Client");
const createOrder = async (req, res) => {
    const { clientId, items } = req.body;
    try {
        let totalAmount = 0;
        for (const item of items) {
            const product = await Product_1.default.findByPk(item.productId);
            if (!product) {
                res.status(404).json({ error: 'Produto não encontrado' });
                return;
            }
            totalAmount += product.price * item.quantity;
        }
        const order = await Order_1.default.create({ clientId, status: 'Pendente', totalAmount });
        const orderItems = [];
        for (const item of items) {
            const product = await Product_1.default.findByPk(item.productId);
            if (!product) {
                res.status(404).json({ error: 'Produto não encontrado' });
                return;
            }
            orderItems.push({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.quantity * product.price,
            });
        }
        await OrderItem_1.default.bulkCreate(orderItems);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar o pedido' });
    }
};
exports.createOrder = createOrder;
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.findAll({
            include: [
                { model: Client_1.Client, as: 'client' },
                {
                    model: OrderItem_1.default,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product_1.default,
                            as: 'product',
                        },
                    ],
                },
            ]
        });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status, items } = req.body;
    try {
        const order = await Order_1.default.findByPk(id);
        if (!order) {
            res.status(404).json({ error: 'Pedido não encontrado' });
            return;
        }
        if (status)
            await order.update({ status });
        if (items && items.length) {
            await OrderItem_1.default.destroy({ where: { orderId: id } });
            let totalAmount = 0;
            const newOrderItems = items.map(async (item) => {
                const product = await Product_1.default.findByPk(item.productId);
                if (!product)
                    throw new Error('Produto não encontrado');
                totalAmount += product.price * item.quantity;
                return {
                    orderId: id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.quantity * product.price,
                };
            });
            await OrderItem_1.default.bulkCreate(await Promise.all(newOrderItems));
            await order.update({ totalAmount });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o pedido' });
    }
};
exports.updateOrder = updateOrder;
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    console.log("ID do pedido a excluir:", id);
    try {
        const order = await Order_1.default.findByPk(id);
        if (!order) {
            res.status(404).json({ error: 'Pedido não encontrado' });
            return;
        }
        await Order_1.default.destroy({ where: { id: id } });
        res.status(200).json({ message: "Pedido excluído com sucesso" });
    }
    catch (error) {
        console.error('Erro ao excluir o pedido:', error);
        res.status(500).json({ error: 'Erro ao excluir o pedido' });
    }
};
exports.deleteOrder = deleteOrder;
const listOrderItems = async (req, res) => {
    try {
        const orders = await Order_1.default.findAll({
            include: [
                { model: OrderItem_1.default, as: 'orderItems', include: [{ model: Product_1.default, as: 'product' }] },
            ]
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao listar itens do pedido' });
    }
};
exports.listOrderItems = listOrderItems;
const addOrderItem = async (req, res) => {
    const { orderId } = req.params;
    const { productId, quantity } = req.body;
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
        if (quantity <= 0) {
            res.status(400).json({ error: 'A quantidade deve ser maior que 0' });
            return;
        }
        const orderItem = await OrderItem_1.default.create({
            orderId,
            productId,
            quantity,
            price: product.price * quantity
        });
        res.status(201).json({ message: 'Item adicionado ao pedido com sucesso', orderItem });
    }
    catch (error) {
        console.error('Erro ao adicionar item ao pedido:', error);
        res.status(500).json({ error: 'Erro ao adicionar item ao pedido' });
    }
};
exports.addOrderItem = addOrderItem;
const removeOrderItem = async (req, res) => {
    const { orderItemId, id } = req.params;
    try {
        const orderItem = await OrderItem_1.default.findOne({ where: { id: orderItemId, orderId: id } });
        if (!orderItem) {
            res.status(404).json({ error: 'Item do pedido não encontrado ou não pertence ao pedido informado' });
            return;
        }
        await orderItem.destroy();
        res.status(200).json({ message: 'Item do pedido removido com sucesso' });
    }
    catch (error) {
        console.error('Erro ao remover item do pedido:', error);
        res.status(500).json({ error: 'Erro ao remover item do pedido' });
    }
};
exports.removeOrderItem = removeOrderItem;
