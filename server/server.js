const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeConnections } = require('./config/dbConnections');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Root Status
app.get('/', (req, res) => {
  res.json({
    name: 'Master Admin API (Velzano, Echo, VDigimarks)',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      search: '/api/search?q=keyword',
      collections: '/api/:project/collections'
    }
  });
});

// Start server after initializing DB connections
async function startServer() {
  await initializeConnections();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Master Admin API running on http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

startServer();
