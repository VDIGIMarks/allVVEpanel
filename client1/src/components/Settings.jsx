import React, { useState, useEffect } from 'react';
import { Database, Save, RefreshCw, CheckCircle, AlertCircle, ShieldAlert, Sparkles, Server } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function Settings({ health, onRefreshHealth, onShowToast }) {
  const [uris, setUris] = useState({
    Echo: '',
    Velzano: '',
    VDM: ''
  });

  const [loading, setLoading] = useState({});

  useEffect(() => {
    async function fetchUris() {
      try {
        const res = await fetch(getApiUrl('/api/config/connection'));
        const data = await res.json();
        if (data.success && data.uris) {
          setUris(prev => ({ ...prev, ...data.uris }));
        }
      } catch (err) {
        console.error('Error fetching URIs:', err);
      }
    }
    fetchUris();
  }, []);

  const handleUpdateUri = async (project) => {
    setLoading(prev => ({ ...prev, [project]: true }));
    try {
      const res = await fetch(getApiUrl('/api/config/connection'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, uri: uris[project] })
      });
      const data = await res.json();
      if (data.success) {
        onRefreshHealth();
        if (data.status?.connected) {
          onShowToast(`Connected to ${project} MongoDB Atlas successfully!`, 'success');
        } else {
          onShowToast(`Failed to connect ${project} Atlas: ${data.status?.error}. Using fallback store.`, 'warning');
        }
      }
    } catch (err) {
      onShowToast(`Error updating ${project} URI: ${err.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, [project]: false }));
    }
  };

  const handleResetSeed = async () => {
    try {
      const res = await fetch(getApiUrl('/api/config/reset-seed'), { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onRefreshHealth();
        onShowToast('Seed fallback data restored successfully!', 'success');
      }
    } catch (err) {
      onShowToast(`Error resetting seed data: ${err.message}`, 'error');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <Server className="w-6 h-6 text-purple-400" /> Database Connection Settings
        </h2>
        <p className="text-xs text-slate-400">
          Configure MongoDB Atlas URIs for Velzano, Echo, and VDigimarks. Connection fallback handles offline testing automatically.
        </p>
      </div>

      {/* URIs Configuration List */}
      <div className="space-y-6">
        {['Velzano', 'Echo', 'VDM'].map((project) => {
          const status = health?.[project];
          const isConnected = status?.connected;
          const isLoading = loading[project];

          return (
            <div key={project} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-white ${
                    project === 'Velzano' ? 'bg-pink-600' : project === 'Echo' ? 'bg-emerald-600' : 'bg-indigo-600'
                  }`}>
                    {project.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{project === 'VDM' ? 'VDigimarks' : project}</h3>
                    <p className="text-xs text-slate-400">MongoDB Connection String</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 font-medium ${
                    isConnected ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {isConnected ? 'Atlas Connected' : 'Demo Fallback'}
                  </span>
                </div>
              </div>

              {/* URI Input & Test Button */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block font-mono">Connection URI</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uris[project]}
                    onChange={(e) => setUris({ ...uris, [project]: e.target.value })}
                    className="flex-1 glass-input rounded-xl px-4 py-2 text-xs font-mono text-slate-200"
                  />
                  <button
                    onClick={() => handleUpdateUri(project)}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-indigo-600/30"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isLoading ? 'Testing...' : 'Test & Connect'}</span>
                  </button>
                </div>

                {status?.error && (
                  <p className="text-[11px] text-amber-400 flex items-center gap-1.5 pt-1 font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Connection alert: {status.error}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Actions */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">System Actions</h3>
        <p className="text-xs text-slate-400">
          Restore default seed datasets for Velzano, Echo, and VDigimarks fallback storage.
        </p>
        <button
          onClick={handleResetSeed}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-2 transition"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>
    </div>
  );
}
