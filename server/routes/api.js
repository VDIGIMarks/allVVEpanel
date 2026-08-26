const express = require('express');
const router = express.Router();
const {
  getOverallStats,
  getCollections,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  globalSearch,
  getConnectionUris,
  updateConnectionUri,
  resetSeedData
} = require('../controllers/databaseController');

// Overall health & stats
router.get('/health', getOverallStats);
router.get('/stats', getOverallStats);

// Global search across databases
router.get('/search', globalSearch);

// Connection URI config & reset
router.get('/config/connection', getConnectionUris);
router.post('/config/connection', updateConnectionUri);
router.post('/config/reset-seed', resetSeedData);

// Collections for a project
router.get('/:project/collections', getCollections);

// Documents in a collection
router.get('/:project/collections/:collection/documents', getDocuments);
router.post('/:project/collections/:collection/documents', createDocument);
router.put('/:project/collections/:collection/documents/:id', updateDocument);
router.delete('/:project/collections/:collection/documents/:id', deleteDocument);

module.exports = router;
