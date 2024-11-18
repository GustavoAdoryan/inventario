import { Request, Response } from "express";
import Client from "../models/Client";
import { Op } from "sequelize";

export const createClient = async (req: Request, res: Response) => {
    const {name, contact, address, cpf_cnpj} = req.body;

    try{
        const client = await Client.create({name, contact, address, cpf_cnpj});
        res.status(201).json(client);
    } catch (error){
        res.status(500).json({error: 'Erro ao criar o cliente '});
    }
};

export const getAllClients = async (req: Request, res: Response) => {
    const {name, cpf_cnpj} = req.query;

    const whereClause: any = {};

    if (name) whereClause.name = { [Op.like]: `%${name}%`};
    if (cpf_cnpj) whereClause.cpf_cnpj = { [Op.like]: `%${cpf_cnpj}%`};


    try{
        const clients = await Client.findAll({ where: whereClause});
        res.json(clients);
    } catch (error){
        res.status(500).json({error: 'Erro ao listar clientes'});
    }
};

export const updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {name, contact, address, cpf_cnpj} = req.body;

    try{
        const client = await Client.findByPk(id);
        if (!client) {
            res.status(404).json({error: "Cliente não encontrado"});
            return;
        }

        await client.update({name,contact,address,cpf_cnpj});
        res.json(client);
        } catch (error){
            res.status(500).json({error: 'Erro ao atualizar cliente'});
    }
};


export const deleteClient = async (req: Request, res: Response) => {
    const {id} = req.params;

    try{
        const client = await Client.findByPk(id);
        if (!client) {
            res.status(404).json({error: 'Cliente não encontrado'});
            return;
        }
        await client.destroy();
        res.json({message: 'Cliente excluido com sucesso'});
    } catch (error){
        res.status(500).json({error: 'Erro ao excluir cliente'});
    }
};

