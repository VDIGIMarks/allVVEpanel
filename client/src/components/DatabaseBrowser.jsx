import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, RefreshCw, Eye, Edit3, Trash2, ChevronLeft, ChevronRight, FileSpreadsheet, Layers, Filter, ShieldCheck } from 'lucide-react';
import { getVelzanoFormLabel } from './Sidebar';

export default function DatabaseBrowser({ project, collection, onSelectCollection, onOpenCreate, onOpenView, onOpenEdit, onDeleteDocument }) {
  const [documents, setDocuments] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [connectionType, setConnectionType] = useState('live');

  // Fetch list of collections for active project
  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch(`/api/${project}/collections`);
        const data = await res.json();
        if (data.success) {
          setCollections(data.collections);
          setConnectionType(data.connectionType);
          if (!collection && data.collections.length > 0) {
            onSelectCollection(data.collections[0].name);
          }
        }
      } catch (err) {
        console.error('Fetch collections error:', err);
      }
    }
    if (project) fetchCollections();
  }, [project]);

  // Fetch documents for selected collection
  const loadDocuments = async () => {
    if (!project || !collection) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/${project}/collections/${collection}/documents?page=${page}&limit=15&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
        setTotalPages(data.totalPages || 1);
        setTotalDocs(data.total || 0);
        setConnectionType(data.connectionType);
      }
    } catch (err) {
      console.error('Fetch documents error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [project, collection, page, search]);

  // Derive dynamic table headers from document keys
  const getTableHeaders = () => {
    if (!documents || documents.length === 0) return ['_id'];
    const keys = new Set();
    documents.forEach(doc => {
      Object.keys(doc).forEach(k => keys.add(k));
    });
    // Keep _id first, then common keys, then remainder up to 8 columns
    const priority = ['_id', 'name', 'email', 'mobile', 'phone', 'company', 'subject', 'message', 'title', 'status', 'category', 'price', 'type', 'createdAt'];
    const ordered = [];
    priority.forEach(p => {
      if (keys.has(p)) {
        ordered.push(p);
        keys.delete(p);
      }
    });
    Array.from(keys).forEach(k => ordered.push(k));
    return ordered.slice(0, 8);
  };

  // Format cell display
  const renderCellContent = (val) => {
    if (val === null || val === undefined) return <span className="text-slate-600 font-mono text-[11px]">null</span>;
    if (typeof val === 'boolean') {
      return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
          {val ? 'TRUE' : 'FALSE'}
        </span>
      );
    }
    if (typeof val === 'object') {
      return <span className="font-mono text-[11px] text-indigo-300">{Array.isArray(val) ? `Array[${val.length}]` : '{...}'}</span>;
    }
    const str = String(val);
    if (str.length > 40) return str.substring(0, 40) + '...';
    return str;
  };

  // Export collection to CSV
  const exportToCSV = () => {
    if (!documents || documents.length === 0) return;
    const headers = getTableHeaders();
    const rows = documents.map(doc => headers.map(h => JSON.stringify(doc[h] ?? '')).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${project}_${collection}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export collection to JSON
  const exportToJSON = () => {
    if (!documents || documents.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(documents, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${project}_${collection}_export.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headers = getTableHeaders();
  const currentVelLabel = project === 'Velzano' ? getVelzanoFormLabel(collection || '').label : collection;

  return (
    <div className="p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Header & Collection Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-3 capitalize">
              <Layers className="w-6 h-6 text-indigo-400" />
              {project === 'VDM' ? 'VDigimarks' : project} • <span className="text-indigo-400">{currentVelLabel}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Showing <span className="font-semibold text-slate-200">{totalDocs}</span> documents in collection • Connected via{' '}
              <span className={`font-mono ${connectionType === 'live' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {connectionType === 'live' ? 'MongoDB Atlas' : 'Fallback Store'}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenCreate(project, collection)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-indigo-600/30"
              title="Create New Document"
            >
              <Plus className="w-4 h-4" />
              <span>Add Document</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
              title="Export CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={exportToJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
              title="Export JSON"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>JSON</span>
            </button>

            <button
              onClick={loadDocuments}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Reload Collection"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collection Pill Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
          {collections.map((col) => {
            const velLabel = project === 'Velzano' ? getVelzanoFormLabel(col.name).label : col.name;
            return (
              <button
                key={col.name}
                onClick={() => {
                  onSelectCollection(col.name);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition flex items-center space-x-2 ${
                  collection === col.name
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{velLabel}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${collection === col.name ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'}`}>
                  {col.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder={`Search ${collection} by name, email, title, status...`}
          className="w-full h-10 pl-10 pr-4 glass-input rounded-xl text-xs text-white placeholder-slate-500"
        />
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {headers.map(h => (
                  <th key={h} className="px-4 py-3 font-mono">{h}</th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={headers.length + 1} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                    <span>Fetching documents from {project}...</span>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="py-12 text-center text-slate-500">
                    No documents found in <span className="font-mono text-slate-400">{collection}</span>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-800/50 transition group">
                    {headers.map(h => (
                      <td key={h} className="px-4 py-3 text-slate-300">
                        {h === '_id' ? (
                          <span className="font-mono text-[11px] text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-800/40">
                            {String(doc._id)}
                          </span>
                        ) : (
                          renderCellContent(doc[h])
                        )}
                      </td>
                    ))}

                    {/* Action Column */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onOpenView(doc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 transition"
                          title="View Record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEdit(project, collection, doc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-slate-400 hover:text-amber-300 transition"
                          title="Edit Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDocument(project, collection, doc._id, loadDocuments)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page <span className="font-semibold text-slate-200">{page}</span> of{' '}
            <span className="font-semibold text-slate-200">{totalPages}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
