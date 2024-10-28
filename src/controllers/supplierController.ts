import { Request, Response } from 'express';
import  Supplier  from '../models/Supplier';
import  Product  from '../models/Product';

export const createSupplier = async (req: Request, res: Response) => {
  const { name, cnpj, contact, address } = req.body;

  try {
    const supplier = await Supplier.create({ name, cnpj, contact, address });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar fornecedor' });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, cnpj, contact, address } = req.body;

  try {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) { 
        res.status(404).json({ error: 'Fornecedor não encontrado' });
        return;
    }

    await supplier.update({ name, cnpj, contact, address });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    
    const associatedProducts = await Product.findOne({ where: { supplierId: id } });
    if (associatedProducts) { 
        res.status(400).json({ error: 'Fornecedor possui produtos associados' });
        return;
    }

    const supplier = await Supplier.findByPk(id);
    if (!supplier) { 
        res.status(404).json({ error: 'Fornecedor não encontrado' });
        return;
    }

    await supplier.destroy();
    res.json({ message: 'Fornecedor excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir fornecedor' });
  }
};