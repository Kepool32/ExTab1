import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { initializeDatabase } from '@config/database';
import { swaggerSpec } from '@config/swagger';
import taskRoutes from '@routes/task.routes';

const nodeEnv = process.env.NODE_ENV || 'development';

if (!process.env.DB_HOST) {
  if (nodeEnv === 'production') {
    dotenv.config({ path: '.env.production' });
  } else {
    dotenv.config({ path: '.env.example' });
  }
}

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests except Swagger docs
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api-docs')) {
    return next();
  }
  limiter(req, res, next);
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON format' });
    return;
  }
  next(err);
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Task Management API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  }),
);

app.use(taskRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Task Management API',
    docs: '/api-docs',
  });
});

app.use((err: Error, req: Request, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`🚀 Server is running on: http://localhost:${port}`);
      console.log(`📚 Swagger documentation: http://localhost:${port}/api-docs`);
      console.log(`🌍 Environment: ${nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
