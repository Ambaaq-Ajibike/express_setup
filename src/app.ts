import express from 'express';
import cors from 'cors';
import { swaggerSpec, swaggerUi } from './swagger';
import router from './routes';
import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import { Request, Response, NextFunction } from 'express';
// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// If you get a 'Cannot find module dotenv' error, run: npm install dotenv

export default app;