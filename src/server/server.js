import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Sweetie Bakery Server!');
});

import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/orders', ordersRoutes);
app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});