import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import dnsRoutes from './routes/dnsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Security & Parsing Middleware
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map((o) => o.trim()),
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  })
);
app.use(express.json());

// Rate Limiting to prevent API abuse
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please wait a few moments before trying again.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

app.use('/api', limiter);

// Mount DNS API routes
app.use('/api', dnsRoutes);

// Root route for quick verification
app.get('/', (req, res) => {
  res.json({
    name: 'DNS Lookup API',
    status: 'online',
    docs: 'Query endpoint: /api/dns?domain=example.com&type=A',
    health: '/api/health',
  });
});

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' not found.`,
    code: 'NOT_FOUND',
  });
});

// Centralized error handler - prevents leaking stack traces
app.use((err, req, res, next) => {
  console.error('[SERVER_UNCAUGHT_ERROR]', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
    code: 'INTERNAL_ERROR',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 DNS Lookup Backend running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
