import express from 'express';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import cors from  'cors';


import sequelize from './config/database';
import productRoutes from './routes/productRoutes';
import clientRoutes from './routes/clientRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Sistema de Gestão de Inventário');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

sequelize.sync({ force: false }).then(() => {
    console.log('Banco de dados sincronizado');
  });

  app.use('/api', productRoutes);
  app.use('/api', clientRoutes);