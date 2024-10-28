import { Request, Response } from 'express';
import Product from '../models/Product';
import { Op } from 'sequelize';


export const getAllProducts = async (req: Request, res: Response) => {
  const { name, supplier, sort } = req.query;

  const whereClause: any = {};

  if (name) whereClause.name = { [Op.like]: `%${name}%` };
  if (supplier) whereClause.supplier = { [Op.like]: `%${supplier}%` };

  const products = await Product.findAll({
    where: whereClause,
    order: sort === 'price_asc' ? [['price', 'ASC']] : sort === 'price_desc' ? [['price', 'DESC']] : [],
  });

  res.json(products);
};


export const createProduct = async (req: Request, res: Response) => {
  const { name, price, stock, description, supplierID } = req.body;
  const imageURL = req.file ? req.file.path : null;


  const product = await Product.create({ name, price, stock, description, supplierID, imageURL });
  res.json(product);
};


export const updateProduct = async (req: Request, res: Response)  => {
  const { id } = req.params;
  const { name, price, stock, description, supplier } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  const product = await Product.findByPk(id);
  if (!product) {res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }

  await product.update({ name, price, stock, description, supplier, imageUrl });
   res.json(product);
};


export const deleteProduct = async (req: Request, res: Response)  => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) { 
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }

  await product.destroy();
  res.json({ message: 'Produto excluído com sucesso' });
};