import React from 'react';
import { Database, Search, ShieldCheck, Activity, RefreshCw, Zap } from 'lucide-react';

export default function Header({ health, onRefreshHealth, onOpenSearch, activeTab, setActiveTab }) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Title & Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight flex items-center gap-2">
            Master Database Hub
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-400" /> Live CRUD Access
            </span>
          </h1>
          <p className="text-xs text-slate-400">Velzano • Echo • VDigimarks (Direct DB Access)</p>
        </div>
      </div>

      {/* Center Search Trigger */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full h-9 glass-input rounded-xl px-3.5 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            Search documents across all 3 databases...
          </span>
          <kbd className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-400 font-mono border border-slate-700">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Database Health Status Pills */}
      <div className="flex items-center space-x-3">
        {/* Project Health Badges */}
        {['Velzano', 'Echo', 'VDM'].map((project) => {
          const status = health?.[project];
          const isConnected = status?.connected;
          const isFallback = status?.isFallback;

          let badgeStyle = "bg-slate-800 text-slate-400 border-slate-700";
          if (isConnected) badgeStyle = "bg-emerald-950/60 text-emerald-400 border-emerald-800/80";
          else if (isFallback) badgeStyle = "bg-amber-950/60 text-amber-400 border-amber-800/80";

          return (
            <button
              key={project}
              onClick={() => setActiveTab(project)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition ${badgeStyle} hover:brightness-110`}
              title={isConnected ? `${project} - Connected to MongoDB Atlas` : `${project} - Demo Fallback Mode`}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-semibold">{project}</span>
              <span className="text-[10px] opacity-75">
                ({isConnected ? 'Live' : 'Demo'})
              </span>
            </button>
          );
        })}

        {/* Refresh Button */}
        <button
          onClick={onRefreshHealth}
          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
          title="Refresh Database Health"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
