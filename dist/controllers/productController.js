"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getAllProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const sequelize_1 = require("sequelize");
const getAllProducts = async (req, res) => {
    const { name, supplier, sort } = req.query;
    const whereClause = {};
    if (name)
        whereClause.name = { [sequelize_1.Op.like]: `%${name}%` };
    if (supplier)
        whereClause.supplier = { [sequelize_1.Op.like]: `%${supplier}%` };
    const products = await Product_1.default.findAll({
        where: whereClause,
        order: sort === 'price_asc' ? [['price', 'ASC']] : sort === 'price_desc' ? [['price', 'DESC']] : [],
    });
    res.json(products);
};
exports.getAllProducts = getAllProducts;
const createProduct = async (req, res) => {
    const { name, price, stock, description, supplierID } = req.body;
    const imageURL = req.file ? req.file.path : null;
    if (price <= 0) {
        res.status(400).json({ error: 'O preço unitário deve ser positivo' });
        return;
    }
    const product = await Product_1.default.create({ name, price, stock, description, supplierID, imageURL });
    res.json(product);
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, description, supplier } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const product = await Product_1.default.findByPk(id);
    if (!product) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
    }
    if (price <= 0) {
        res.status(400).json({ error: 'O preço unitário deve ser positivo' });
        return;
    }
    if (stock <= 0) {
        res.status(400).json({ error: 'A quantidade deve ser maior que 0' });
        return;
    }
    await product.update({ name, price, stock, description, supplier, imageUrl });
    res.json(product);
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product_1.default.findByPk(id);
    if (!product) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
    }
    await product.destroy();
    res.json({ message: 'Produto excluído com sucesso' });
};
exports.deleteProduct = deleteProduct;
