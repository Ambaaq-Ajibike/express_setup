import express from 'express';
import cors from 'cors';
import { swaggerSpec, swaggerUi } from './swagger';
import { router } from './routes';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API docs at http://localhost:${PORT}/api-docs`);
});

export default app;