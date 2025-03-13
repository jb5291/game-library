import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import gameRoutes from './routes/gameRoutes';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/game-library';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/games', gameRoutes);
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Game Library API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});