"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getAllClients = exports.createClient = void 0;
const Client_1 = require("../models/Client");
const sequelize_1 = require("sequelize");
const createClient = async (req, res) => {
    const { name, contact, address, cpf_cnpj } = req.body;
    try {
        const client = await Client_1.Client.create({ name, contact, address, cpf_cnpj });
        res.status(201).json(client);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar o cliente ' });
    }
};
exports.createClient = createClient;
const getAllClients = async (req, res) => {
    const { name, cpf_cnpj } = req.query;
    const whereClause = {};
    if (name)
        whereClause.name = { [sequelize_1.Op.like]: `%${name}%` };
    if (cpf_cnpj)
        whereClause.cpf_cnpj = { [sequelize_1.Op.like]: `%${cpf_cnpj}%` };
    try {
        const clients = await Client_1.Client.findAll({ where: whereClause });
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao listar clientes' });
    }
};
exports.getAllClients = getAllClients;
const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, contact, address, cpf_cnpj } = req.body;
    try {
        const client = await Client_1.Client.findByPk(id);
        if (!client) {
            res.status(404).json({ error: "Cliente não encontrado" });
            return;
        }
        await client.update({ name, contact, address, cpf_cnpj });
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
};
exports.updateClient = updateClient;
const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Client_1.Client.findByPk(id);
        if (!client) {
            res.status(404).json({ error: 'Cliente não encontrado' });
            return;
        }
        await client.destroy();
        res.json({ message: 'Cliente excluido com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
};
exports.deleteClient = deleteClient;
