import express from 'express';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';


import sequelize from './config/database';
import productRoutes from './routes/productRoutes';
import clientRoutes from './routes/clientRoutes';
import supplierRoutes from './routes/supplierRoutes';
import orderRoutes from './routes/orderRoutes';
import transactionRoutes from './routes/transactionRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Sistema de Gestão de Inventário');
});

app.use('/api', productRoutes);
app.use('/api', clientRoutes);
app.use('/api', supplierRoutes);
app.use('/api', orderRoutes);
app.use('/api', transactionRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Banco de dados sincronizado');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

