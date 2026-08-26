const dns = require('dns');
require('dotenv').config();

// Set public DNS servers for MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.log('DNS setServers notice:', e.message);
}

const { MongoClient } = require('mongodb');

// Active connection clients and status tracking
const clients = {};
const connectionStatus = {
  Echo: { connected: false, error: null, collections: [] },
  Velzano: { connected: false, error: null, collections: [] },
  VDM: { connected: false, error: null, collections: [] }
};

/**
 * Get URIs from .env file
 */
function getEnvUris() {
  return {
    Echo: process.env.ECHO_MONGO_URI || '',
    Velzano: process.env.VELZANO_MONGO_URI || '',
    VDM: process.env.VDM_MONGO_URI || ''
  };
}

/**
 * Initialize connections directly to databases defined in .env
 */
async function initializeConnections() {
  const uris = getEnvUris();
  console.log('Connecting directly to MongoDB databases from .env...');

  for (const [dbKey, uri] of Object.entries(uris)) {
    if (!uri) {
      connectionStatus[dbKey] = {
        connected: false,
        error: `No URI found in .env for ${dbKey}_MONGO_URI`,
        collections: []
      };
      continue;
    }
    await connectDatabase(dbKey, uri);
  }
}

/**
 * Connect to a specific MongoDB database
 */
async function connectDatabase(dbKey, uri) {
  if (clients[dbKey]) {
    try {
      await clients[dbKey].close();
    } catch (_) {}
  }

  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 6000,
      tlsAllowInvalidCertificates: true,
    });

    await client.connect();
    clients[dbKey] = client;

    const db = client.db();
    const cols = await db.listCollections().toArray();

    connectionStatus[dbKey] = {
      connected: true,
      error: null,
      uri: uri,
      collections: cols.map(c => c.name)
    };

    console.log(`[Database Connected] ${dbKey}: ${cols.length} collections -> [${cols.map(c => c.name).join(', ')}]`);
  } catch (err) {
    console.warn(`[Database Connection Alert] ${dbKey} failed: ${err.message}`);
    connectionStatus[dbKey] = {
      connected: false,
      error: err.message,
      uri: uri,
      collections: []
    };
  }
}

/**
 * Get database handle for a project
 */
function getDb(dbKey) {
  if (connectionStatus[dbKey]?.connected && clients[dbKey]) {
    return {
      connected: true,
      db: clients[dbKey].db()
    };
  }
  return {
    connected: false,
    error: connectionStatus[dbKey]?.error || 'Database not connected'
  };
}

/**
 * Get health overview
 */
function getHealthStatus() {
  return connectionStatus;
}

module.exports = {
  initializeConnections,
  connectDatabase,
  getDb,
  getHealthStatus,
  getEnvUris
};
