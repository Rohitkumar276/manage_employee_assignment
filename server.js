import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Middlewares
app.use(express.json());
app.use(cors());
// Routes
app.use('/', userRoutes);         // User authentication routes
app.use('/', employeeRoutes);     // Employee routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
