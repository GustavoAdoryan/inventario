import { Request, Response } from 'express';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Product from '../models/Product';
import { Client } from '../models/Client';



export const createOrder = async (req: Request, res: Response) => {
    const { clientId, items } = req.body;

    try {
        let totalAmount = 0;


        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                res.status(404).json({ error: 'Produto não encontrado' });
                return;
            }
            totalAmount += product.price * item.quantity;
        }


        const order = await Order.create({ clientId, status: 'Pendente', totalAmount });


        const orderItems = [];
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
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
        await OrderItem.bulkCreate(orderItems);

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o pedido' });
    }
};


export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: Client, as: 'client' },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
            ]
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
};


export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, items } = req.body;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            res.status(404).json({ error: 'Pedido não encontrado' });
            return;
        }

        if (status) await order.update({ status });

        if (items && items.length) {
            await OrderItem.destroy({ where: { orderId: id } });

            let totalAmount = 0;
            const newOrderItems = items.map(async (item: { productId: number, quantity: number }) => {
                const product = await Product.findByPk(item.productId);
                if (!product) throw new Error('Produto não encontrado');
                totalAmount += product.price * item.quantity;

                return {
                    orderId: id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.quantity * product.price,
                };
            });

            await OrderItem.bulkCreate(await Promise.all(newOrderItems));
            await order.update({ totalAmount });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o pedido' });
    }
};


export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("ID do pedido a excluir:", id);
    try {
        const order = await Order.findByPk(id);
        if (!order) {
            res.status(404).json({ error: 'Pedido não encontrado' });
            return;
        }

        await Order.destroy({ where: { id: id } });
        res.status(200).json({ message: "Pedido excluído com sucesso" });
    } catch (error) {
        console.error('Erro ao excluir o pedido:', error);
        res.status(500).json({ error: 'Erro ao excluir o pedido' });
    }
};


export const listOrderItems = async (req: Request, res: Response) => {

    try {
        const orders = await Order.findAll({
            include: [
                { model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] },
            ]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar itens do pedido' });
    }
};

export const addOrderItem = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { productId, quantity } = req.body;

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

        if (quantity <= 0) {
            res.status(400).json({ error: 'A quantidade deve ser maior que 0' });
            return;
        }

        const orderItem = await OrderItem.create({
            orderId,
            productId,
            quantity,
            price: product.price * quantity
        });

        res.status(201).json({ message: 'Item adicionado ao pedido com sucesso', orderItem });
    } catch (error) {
        console.error('Erro ao adicionar item ao pedido:', error);
        res.status(500).json({ error: 'Erro ao adicionar item ao pedido' });
    }
};


export const removeOrderItem = async (req: Request, res: Response) => {
    const { orderItemId, id } = req.params;

    try {

        const orderItem = await OrderItem.findOne({ where: { id: orderItemId, orderId: id } });

        if (!orderItem) {
            res.status(404).json({ error: 'Item do pedido não encontrado ou não pertence ao pedido informado' });
            return;
        }


        await orderItem.destroy();
        res.status(200).json({ message: 'Item do pedido removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover item do pedido:', error);
        res.status(500).json({ error: 'Erro ao remover item do pedido' });
    }
};