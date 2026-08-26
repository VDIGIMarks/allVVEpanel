import React, { useState } from 'react';
import { Search, Database, Layers, ArrowRight, FileText, Sparkles, Filter } from 'lucide-react';

export default function UnifiedSearch({ onNavigateToDoc }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setSearched(true);
      }
    } catch (err) {
      console.error('Global search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Search Header Banner */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Cross-Database Intelligence
        </div>
        <h2 className="text-3xl font-extrabold text-white">Unified Global Search</h2>
        <p className="text-xs text-slate-400">
          Query any document across Velzano, Echo, and VDigimarks databases simultaneously.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword, email, phone, name, property, title..."
              className="w-full h-11 pl-10 pr-4 glass-input rounded-xl text-sm text-white placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </form>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Found <span className="font-semibold text-white">{results.length}</span> matching record(s)
            </span>
          </div>

          <div className="space-y-3">
            {results.length === 0 ? (
              <div className="glass-panel p-12 text-center text-slate-500 rounded-2xl">
                No matching documents found for "{query}".
              </div>
            ) : (
              results.map((item, idx) => {
                const doc = item.document;
                const title = doc.name || doc.title || doc.email || doc._id;

                return (
                  <div
                    key={idx}
                    className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          item.project === 'Velzano' ? 'badge-velzano' : item.project === 'Echo' ? 'badge-echo' : 'badge-vdm'
                        }`}>
                          {item.project}
                        </span>
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                          {item.collection}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                        {String(title)}
                      </h4>

                      <div className="text-xs text-slate-400 font-mono line-clamp-1">
                        {JSON.stringify(doc).substring(0, 120)}...
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateToDoc(item.project, item.collection, doc)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                    >
                      <span>Open Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
