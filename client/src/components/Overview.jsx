import React from 'react';
import { Database, Layers, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles, RefreshCw, Zap, Server } from 'lucide-react';
import { getVelzanoFormLabel } from './Sidebar';

export default function Overview({ stats, health, onSelectCollection, onRefresh }) {
  const projectLogos = {
    Velzano: { title: 'Velzano Real Estate', color: 'from-pink-500 to-rose-600', badgeClass: 'badge-velzano', textColor: 'text-pink-400', border: 'border-pink-500/30' },
    Echo: { title: 'Echo Resort & Jungle Stay', color: 'from-emerald-500 to-teal-600', badgeClass: 'badge-echo', textColor: 'text-emerald-400', border: 'border-emerald-500/30' },
    VDM: { title: 'VDigimarks Marketing & Tech', color: 'from-indigo-500 to-cyan-600', badgeClass: 'badge-vdm', textColor: 'text-indigo-400', border: 'border-indigo-500/30' }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-64 h-64 text-indigo-400" />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Unified Multi-Database Control Panel
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Velzano, Echo & VDigimarks Central Hub
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Monitor live document counts, query collections, perform CRUD operations, and search across all databases in real-time.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Databases</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalProjects || 3}</div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
            Echo, Velzano & VDigimarks
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Collections</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalCollections || 0}</div>
          <div className="text-xs text-slate-400">Across 3 MongoDB Clusters</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Records</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalDocuments || 0}</div>
          <div className="text-xs text-slate-400">Indexed & Searchable</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Status</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 flex items-center gap-2">
            {stats?.liveCount || 0} / 3
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{stats?.liveCount > 0 ? 'Atlas Live Connected' : 'Demo Fallback'}</span>
            <button onClick={onRefresh} className="hover:text-white transition">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Database Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Velzano', 'Echo', 'VDM'].map((projectKey) => {
          const info = projectLogos[projectKey];
          const projectData = stats?.projects?.[projectKey];
          const status = health?.[projectKey];
          const isConnected = status?.connected;

          return (
            <div
              key={projectKey}
              className={`glass-panel p-6 rounded-2xl border ${info.border} space-y-5 flex flex-col justify-between hover:border-slate-700 transition`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${info.color} flex items-center justify-center font-bold text-white shadow-md`}>
                      {projectKey.substring(0, 1)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{projectKey === 'VDM' ? 'VDigimarks' : projectKey}</h3>
                      <p className="text-[11px] text-slate-400">{info.title}</p>
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                    isConnected ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {isConnected ? 'Atlas Connected' : 'Fallback Data'}
                  </span>
                </div>

                {/* Collections Breakdown */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>Collections</span>
                    <span>Doc Count</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {projectData?.collections?.map((col) => {
                      const displayLabel = projectKey === 'Velzano' ? getVelzanoFormLabel(col.name).label : col.name;
                      return (
                        <button
                          key={col.name}
                          onClick={() => onSelectCollection(projectKey, col.name)}
                          className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-xs transition group"
                        >
                          <span className="font-mono text-slate-300 capitalize group-hover:text-indigo-300">
                            {displayLabel}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white font-mono font-bold transition">
                            {col.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <button
                onClick={() => onSelectCollection(projectKey, projectData?.collections?.[0]?.name || 'users')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition ${info.badgeClass} hover:brightness-125`}
              >
                <span>Browse {projectKey} Database</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
