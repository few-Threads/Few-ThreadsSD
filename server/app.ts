import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectToDatabase } from './lib/mongodb';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter, aiLimiter } from './middleware/rateLimiter';
import { sanitizeInput } from './middleware/sanitize';
import { devLogger, prodLogger } from './middleware/requestLogger';

// Import routes
import authRoutes from './routes/auth';
import diagramRoutes from './routes/diagrams';
import scenarioRoutes from './routes/scenarios';
import progressRoutes from './routes/progress';
import aiRoutes from './routes/ai';
import feedbackRoutes from './routes/feedback';
import knowledgeRoutes from './routes/knowledge';
import registryRoutes from './routes/registry';

const app = express();
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

// Behind Vercel's proxy — needed so rate limiting sees the real client IP
app.set('trust proxy', 1);

// Security headers (add EARLY)
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for now — Canvas needs inline scripts
  crossOriginEmbedderPolicy: false
}));

// Request logging
app.use(isProduction ? prodLogger : devLogger);

// Allowed origins: any localhost port in dev, the Vercel deployment URLs, plus anything in CORS_ORIGINS (comma-separated)
const allowedOrigins = new Set(
  [
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    ...(process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()),
  ].filter(Boolean) as string[]
);

const corsOptions: cors.CorsOptions = {
  // Same-origin requests (the normal case on Vercel) send no Origin header and are always allowed
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin) || (!isProduction && /^http:\/\/localhost:\d+$/.test(origin))),
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Groq-API-Key', 'X-Gemini-API-Key'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

// Health check endpoint (no DB needed)
app.get(['/health', '/api/health'], (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Few Threads API is healthy' });
});

// Ensure a DB connection exists before handling API requests (connection is cached across warm invocations)
app.use('/api', async (_req, _res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Apply rate limiting (API routes, specific auth routes, AI routes)
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/ai/', aiLimiter);

// Body parser
app.use(express.json());

// Sanitize all inputs (requires body parser to have run first)
app.use(sanitizeInput);

// Mount routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/diagrams', diagramRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/registry', registryRoutes);

// Global error handler (should be mounted last)
app.use(errorHandler);

export default app;
