"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.getlAllSupplier = exports.updateSupplier = exports.createSupplier = void 0;
const Supplier_1 = __importDefault(require("../models/Supplier"));
const Product_1 = __importDefault(require("../models/Product"));
const sequelize_1 = require("sequelize");
const createSupplier = async (req, res) => {
    const { name, cnpj, contact, address } = req.body;
    try {
        const supplier = await Supplier_1.default.create({ name, cnpj, contact, address });
        res.status(201).json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar fornecedor' });
    }
};
exports.createSupplier = createSupplier;
const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, cnpj, contact, address } = req.body;
    try {
        const supplier = await Supplier_1.default.findByPk(id);
        if (!supplier) {
            res.status(404).json({ error: 'Fornecedor não encontrado' });
            return;
        }
        await supplier.update({ name, cnpj, contact, address });
        res.json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
    }
};
exports.updateSupplier = updateSupplier;
const getlAllSupplier = async (req, res) => {
    const { name, contact } = req.query;
    const whereClause = {};
    if (name)
        whereClause.name = { [sequelize_1.Op.like]: `%${name}%` };
    if (contact)
        whereClause.contact = { [sequelize_1.Op.like]: `%${contact}%` };
    try {
        const supplier = await Supplier_1.default.findAll({ where: whereClause });
        res.json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao listar fornecedores' });
    }
};
exports.getlAllSupplier = getlAllSupplier;
const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const associatedProducts = await Product_1.default.findOne({ where: { supplierId: id } });
        if (associatedProducts) {
            res.status(400).json({ error: 'Fornecedor possui produtos associados' });
            return;
        }
        const supplier = await Supplier_1.default.findByPk(id);
        if (!supplier) {
            res.status(404).json({ error: 'Fornecedor não encontrado' });
            return;
        }
        await supplier.destroy();
        res.json({ message: 'Fornecedor excluído com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao excluir fornecedor' });
    }
};
exports.deleteSupplier = deleteSupplier;
