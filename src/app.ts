import express from 'express';
import cors from 'cors';
import { swaggerSpec, swaggerUi } from './swagger';
import router from './routes';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

// Debug middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api', router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


export default app;