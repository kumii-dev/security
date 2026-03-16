/**
 * Express application entry point
 * Kumii Admin Dashboard — BFF Backend
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Routes
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import startupsRoutes from './routes/startups.js';
import applicationsRoutes from './routes/applications.js';
import investorsRoutes from './routes/investors.js';
import opportunitiesRoutes from './routes/opportunities.js';
import impactRoutes from './routes/impact.js';
import complianceRoutes from './routes/compliance.js';
import reportsRoutes from './routes/reports.js';
import tasksRoutes from './routes/tasks.js';
import auditRoutes from './routes/auditLogs.js';
import settingsRoutes from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://kumii.africa', 'https://*.supabase.co'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        frameAncestors: [
          "'self'",
          'https://kumii.africa',
          'https://*.lovable.app',
          'https://*.lovableproject.com',
          'https://*.gptengineer.app',
        ],
      },
    },
    // Allow iframe embedding from kumii.africa — do not set DENY
    frameguard: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS — restrict to admin frontend origin ─────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Request logging ──────────────────────────────────────────────────────────
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(requestLogger);

// ─── Rate limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts. Please wait before retrying.' },
});
app.use('/api/auth', authLimiter);

// ─── Health check (accessible via /api/health through Vercel rewrite) ────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'kumii-admin-api' });
});
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'kumii-admin-api' });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/startups', startupsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/investors', investorsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/settings', settingsRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚀 Kumii Admin API running on port ${PORT}`);
});

export default app;
