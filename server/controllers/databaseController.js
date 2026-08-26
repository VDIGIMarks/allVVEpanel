const { ObjectId } = require('mongodb');
const { getDb, getHealthStatus, connectDatabase, getEnvUris } = require('../config/dbConnections');
const seedDatabase = require('../seedData');

/**
 * Get Overall Dashboard Stats across all 3 databases
 */
async function getOverallStats(req, res) {
  try {
    const health = getHealthStatus();
    const stats = {
      totalProjects: 3,
      liveCount: 0,
      disconnectedCount: 0,
      totalCollections: 0,
      totalDocuments: 0,
      readOnlyMode: false,
      projects: {}
    };

    for (const dbKey of ['Echo', 'Velzano', 'VDM']) {
      const status = health[dbKey];
      if (status.connected) stats.liveCount++;
      else stats.disconnectedCount++;

      const handle = getDb(dbKey);
      let collections = [];
      let docCount = 0;
      const collectionDetails = [];

      if (handle.connected) {
        const colList = await handle.db.listCollections().toArray();
        collections = colList.map(c => c.name);
        for (const colName of collections) {
          const count = await handle.db.collection(colName).countDocuments();
          docCount += count;
          collectionDetails.push({ name: colName, count });
        }
      } else {
        // Fallback seed store stats
        const fallbackCols = seedDatabase[dbKey] || {};
        collections = Object.keys(fallbackCols);
        for (const colName of collections) {
          const count = fallbackCols[colName].length;
          docCount += count;
          collectionDetails.push({ name: colName, count });
        }
      }

      stats.totalCollections += collections.length;
      stats.totalDocuments += docCount;

      stats.projects[dbKey] = {
        name: dbKey,
        connected: status.connected,
        error: status.error,
        connectionType: status.connected ? 'live' : 'fallback',
        totalCollections: collections.length,
        totalDocuments: docCount,
        collections: collectionDetails
      };
    }

    res.json({ success: true, stats, health });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Get Collections list for a project
 */
async function getCollections(req, res) {
  try {
    const { project } = req.params;
    const handle = getDb(project);

    if (handle.connected) {
      const colList = await handle.db.listCollections().toArray();
      const collections = [];
      for (const c of colList) {
        const count = await handle.db.collection(c.name).countDocuments();
        collections.push({ name: c.name, count });
      }
      return res.json({
        success: true,
        project,
        connected: true,
        connectionType: 'live',
        collections
      });
    } else {
      // Fallback seed collections
      const fallbackCols = seedDatabase[project] || {};
      const collections = Object.keys(fallbackCols).map(colName => ({
        name: colName,
        count: fallbackCols[colName].length
      }));
      return res.json({
        success: true,
        project,
        connected: false,
        connectionType: 'fallback',
        collections
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Helper to resolve actual collection name in MongoDB Atlas or Seed Store
 */
async function resolveCollectionName(handle, project, requestedCol) {
  if (!handle.connected) {
    const fallbackStore = seedDatabase[project] || {};
    if (fallbackStore[requestedCol]) return requestedCol;
    const lower = requestedCol.toLowerCase();
    const keys = Object.keys(fallbackStore);
    if (lower.includes('partner')) return keys.find(k => k.toLowerCase().includes('partner')) || requestedCol;
    if (lower.includes('enquir') || lower.includes('inquir') || lower.includes('submit')) return keys.find(k => k.toLowerCase().includes('enquir') || k.toLowerCase().includes('inquir') || k.toLowerCase().includes('submit')) || requestedCol;
    if (lower.includes('connect') || lower.includes('contact')) return keys.find(k => k.toLowerCase().includes('connect') || k.toLowerCase().includes('contact')) || requestedCol;
    if (lower.includes('subscrib')) return keys.find(k => k.toLowerCase().includes('subscrib')) || requestedCol;
    return requestedCol;
  }

  try {
    const colList = await handle.db.listCollections().toArray();
    const colNames = colList.map(c => c.name);
    if (colNames.includes(requestedCol)) return requestedCol;

    const lower = requestedCol.toLowerCase();
    const exactCi = colNames.find(c => c.toLowerCase() === lower);
    if (exactCi) return exactCi;

    if (lower.includes('partner')) {
      const match = colNames.find(c => c.toLowerCase().includes('partner'));
      if (match) return match;
    }
    if (lower.includes('enquir') || lower.includes('inquir') || lower.includes('submit')) {
      const match = colNames.find(c => c.toLowerCase().includes('enquir') || c.toLowerCase().includes('inquir') || c.toLowerCase().includes('submit'));
      if (match) return match;
    }
    if (lower.includes('connect') || lower.includes('contact')) {
      const match = colNames.find(c => c.toLowerCase().includes('connect') || c.toLowerCase().includes('contact'));
      if (match) return match;
    }
    if (lower.includes('subscrib')) {
      const match = colNames.find(c => c.toLowerCase().includes('subscrib'));
      if (match) return match;
    }

    return requestedCol;
  } catch (_) {
    return requestedCol;
  }
}

/**
 * Get Documents from a collection
 */
async function getDocuments(req, res) {
  try {
    const { project, collection } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = (req.query.search || '').trim().toLowerCase();
    const handle = getDb(project);
    const targetCol = await resolveCollectionName(handle, project, collection);

    if (handle.connected) {
      const col = handle.db.collection(targetCol);
      let query = {};
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { message: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            { property: { $regex: search, $options: 'i' } },
            { partnerName: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
            { proposal: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const total = await col.countDocuments(query);
      const docs = await col.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      return res.json({
        success: true,
        project,
        collection: targetCol,
        connected: true,
        connectionType: 'live',
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        documents: docs
      });
    } else {
      // Fallback seed store
      let list = seedDatabase[project]?.[targetCol] || [];
      if (search) {
        list = list.filter(doc => JSON.stringify(doc).toLowerCase().includes(search));
      }
      const total = list.length;
      const startIndex = (page - 1) * limit;
      const docs = list.slice(startIndex, startIndex + limit);

      return res.json({
        success: true,
        project,
        collection: targetCol,
        connected: false,
        connectionType: 'fallback',
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        documents: docs
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Create Document
 */
async function createDocument(req, res) {
  try {
    const { project, collection } = req.params;
    const handle = getDb(project);
    const targetCol = await resolveCollectionName(handle, project, collection);
    const payload = { ...req.body };
    delete payload._id;

    if (handle.connected) {
      const result = await handle.db.collection(targetCol).insertOne(payload);
      return res.json({
        success: true,
        message: 'Document created successfully in MongoDB Atlas',
        insertedId: result.insertedId
      });
    } else {
      // Fallback seed store insertion
      if (!seedDatabase[project]) seedDatabase[project] = {};
      if (!seedDatabase[project][targetCol]) seedDatabase[project][targetCol] = [];
      const newId = `${project.toLowerCase()}_${targetCol}_${Date.now()}`;
      const newDoc = { _id: newId, ...payload, createdAt: new Date().toISOString() };
      seedDatabase[project][targetCol].unshift(newDoc);
      return res.json({
        success: true,
        message: 'Document created successfully in Fallback Store',
        insertedId: newId
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Update Document
 */
async function updateDocument(req, res) {
  try {
    const { project, collection, id } = req.params;
    const handle = getDb(project);
    const targetCol = await resolveCollectionName(handle, project, collection);
    const updateData = { ...req.body };
    delete updateData._id;

    if (handle.connected) {
      let filter;
      if (ObjectId.isValid(id)) {
        filter = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      } else {
        filter = { _id: id };
      }
      const result = await handle.db.collection(targetCol).updateOne(filter, { $set: updateData });
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }
      return res.json({
        success: true,
        message: 'Document updated successfully in MongoDB Atlas',
        modifiedCount: result.modifiedCount
      });
    } else {
      // Fallback seed store update
      const list = seedDatabase[project]?.[targetCol] || [];
      const index = list.findIndex(doc => String(doc._id) === String(id));
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Document not found in Fallback Store' });
      }
      seedDatabase[project][targetCol][index] = { ...list[index], ...updateData };
      return res.json({
        success: true,
        message: 'Document updated successfully in Fallback Store',
        modifiedCount: 1
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Delete Document
 */
async function deleteDocument(req, res) {
  try {
    const { project, collection, id } = req.params;
    const handle = getDb(project);
    const targetCol = await resolveCollectionName(handle, project, collection);

    if (handle.connected) {
      let filter;
      if (ObjectId.isValid(id)) {
        filter = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      } else {
        filter = { _id: id };
      }
      const result = await handle.db.collection(targetCol).deleteOne(filter);
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }
      return res.json({
        success: true,
        message: 'Document deleted successfully from MongoDB Atlas',
        deletedCount: result.deletedCount
      });
    } else {
      // Fallback seed store deletion
      const list = seedDatabase[project]?.[targetCol] || [];
      const initialLen = list.length;
      seedDatabase[project][targetCol] = list.filter(doc => String(doc._id) !== String(id));
      if (seedDatabase[project][targetCol].length === initialLen) {
        return res.status(404).json({ success: false, error: 'Document not found in Fallback Store' });
      }
      return res.json({
        success: true,
        message: 'Document deleted successfully from Fallback Store',
        deletedCount: 1
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Global Search across connected MongoDB databases and fallback stores
 */
async function globalSearch(req, res) {
  try {
    const query = (req.query.q || '').trim().toLowerCase();
    if (!query) {
      return res.json({ success: true, results: [] });
    }

    const results = [];
    for (const dbKey of ['Echo', 'Velzano', 'VDM']) {
      const handle = getDb(dbKey);
      if (handle.connected) {
        const colList = await handle.db.listCollections().toArray();
        for (const c of colList) {
          const docs = await handle.db.collection(c.name).find().limit(50).toArray();
          for (const doc of docs) {
            if (JSON.stringify(doc).toLowerCase().includes(query)) {
              results.push({ project: dbKey, collection: c.name, document: doc });
            }
          }
        }
      } else {
        // Search fallback store
        const fallbackCols = seedDatabase[dbKey] || {};
        for (const [colName, docs] of Object.entries(fallbackCols)) {
          for (const doc of docs) {
            if (JSON.stringify(doc).toLowerCase().includes(query)) {
              results.push({ project: dbKey, collection: colName, document: doc });
            }
          }
        }
      }
    }

    res.json({ success: true, query, totalMatches: results.length, results: results.slice(0, 100) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Get Connection URIs from .env
 */
async function getConnectionUris(req, res) {
  try {
    const uris = getEnvUris();
    res.json({ success: true, uris });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Update Connection URI in .env file & reconnect
 */
const fs = require('fs');
const path = require('path');

async function updateConnectionUri(req, res) {
  try {
    const { project, uri } = req.body;
    if (!project || !uri) {
      return res.status(400).json({ success: false, error: 'Project and URI are required' });
    }

    await connectDatabase(project, uri);
    const status = getHealthStatus()[project];

    if (status.connected) {
      const envPath = path.join(__dirname, '../.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        const envKey = `${project.toUpperCase()}_MONGO_URI`;
        const regex = new RegExp(`^${envKey}=.*$`, 'm');
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${envKey}=${uri}`);
        } else {
          envContent += `\n${envKey}=${uri}`;
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
        process.env[envKey] = uri;
      }
    }

    res.json({ success: true, project, status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Reset Connections / Reload
 */
async function resetSeedData(req, res) {
  try {
    const { initializeConnections } = require('../config/dbConnections');
    await initializeConnections();
    res.json({ success: true, message: 'Database connections refreshed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
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
};
