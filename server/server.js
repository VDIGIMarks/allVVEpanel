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

// Serve Client Static Build if available
const fs = require('fs');
const client1Dist = path.join(__dirname, '../client1/dist');
const clientDist = path.join(__dirname, '../client/dist');
const altClientDist = path.join(__dirname, './dist');

let staticPath = null;
if (fs.existsSync(client1Dist)) {
  staticPath = client1Dist;
} else if (fs.existsSync(clientDist)) {
  staticPath = clientDist;
} else if (fs.existsSync(altClientDist)) {
  staticPath = altClientDist;
}

if (staticPath) {
  app.use(express.static(staticPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(staticPath, 'index.html'));
  });
} else {
  // Root Status Endpoint
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
}

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
