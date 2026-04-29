// Initial Express Setup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Routes Import
const voteRoutes = require('./routes/vote');
const dataRoutes = require('./routes/data');
const countsRoutes = require('./routes/counts');
const resultsRoutes = require('./routes/results');

// Middleware Import
const errorHandler = require('./middleware/errorHandler');
const knex = require('./config/knex');

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting setup for abuse prevention
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
});
app.use(limiter);

// Connect Routes
app.use('/vote', voteRoutes);
app.use('/data', dataRoutes);
app.use('/counts', countsRoutes);
app.use('/results', resultsRoutes);

// Health Check Endpoint
app.get('/health', async (req, res) => {
  let dbStatus = 'connected';
  try {
    await knex.raw('SELECT 1');
  } catch (err) {
    dbStatus = 'disconnected';
  }

  res.json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// General Route Test
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use(errorHandler);

const startServer = (port = process.env.PORT || 3000) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;


