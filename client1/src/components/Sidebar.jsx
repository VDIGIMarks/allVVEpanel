import React from 'react';
import { LayoutDashboard, Database, Search, Settings, ChevronRight, Handshake, FileText, MessageSquare, Mail } from 'lucide-react';

export function getVelzanoFormLabel(col) {
  const lower = col.toLowerCase();
  if (lower.includes('partner')) return { label: '1. Partner With Us', Icon: Handshake };
  if (lower.includes('enquir') || lower.includes('inquir') || lower.includes('submit')) return { label: '2. Submit Enquiry', Icon: FileText };
  if (lower.includes('connect') || lower.includes('contact')) return { label: "3. Let's Connect", Icon: MessageSquare };
  if (lower.includes('subscrib')) return { label: '4. Subscribe', Icon: Mail };
  return { label: col, Icon: null };
}

export default function Sidebar({ activeTab, setActiveTab, selectedCollection, setSelectedCollection, health }) {
  const projectConfigs = {
    Velzano: {
      color: 'text-pink-400',
      badge: 'badge-velzano',
      bgGlow: 'from-pink-500/10 to-purple-500/10',
      collections: ['partners', 'inquiries', 'contacts', 'subscribers']
    },
    Echo: {
      color: 'text-emerald-400',
      badge: 'badge-echo',
      bgGlow: 'from-emerald-500/10 to-teal-500/10',
      collections: ['sitevisits', 'properties', 'enquiries', 'resorts', 'villas', 'users']
    },
    VDM: {
      color: 'text-indigo-400',
      badge: 'badge-vdm',
      bgGlow: 'from-indigo-500/10 to-blue-500/10',
      collections: ['contacts', 'services', 'auditrequests', 'users']
    }
  };

  const handleSelectProjectCollection = (project, collection) => {
    setActiveTab(project);
    setSelectedCollection(collection);
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Navigation Section */}
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 px-2">
            Main Navigation
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('Overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'Overview'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('Search')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'Search'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Unified Global Search</span>
            </button>
          </nav>
        </div>

        {/* Database Projects Section */}
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 px-2">
            Databases & Collections
          </div>
          <div className="space-y-4">
            {Object.keys(projectConfigs).map((projectKey) => {
              const config = projectConfigs[projectKey];
              const isActive = activeTab === projectKey;
              const status = health?.[projectKey];

              return (
                <div key={projectKey} className="space-y-1">
                  {/* Project Header Switcher */}
                  <button
                    onClick={() => {
                      setActiveTab(projectKey);
                      if (!selectedCollection || !config.collections.includes(selectedCollection)) {
                        setSelectedCollection(config.collections[0]);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? `bg-slate-800 text-white border border-slate-700 shadow-sm`
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Database className={`w-4 h-4 ${config.color}`} />
                      <span>{projectKey === 'VDM' ? 'VDigimarks' : projectKey}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${status?.connected ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                        {status?.connected ? 'LIVE' : 'DEMO'}
                      </span>
                    </div>
                  </button>

                  {/* Sub Collections List */}
                  <div className="ml-3 pl-3 border-l border-slate-800 space-y-0.5 py-1">
                    {config.collections.map((col) => {
                      const isColActive = isActive && selectedCollection === col;
                      const velInfo = projectKey === 'Velzano' ? getVelzanoFormLabel(col) : null;
                      const displayLabel = velInfo ? velInfo.label : col;
                      const IconComponent = velInfo?.Icon;

                      return (
                        <button
                          key={col}
                          onClick={() => handleSelectProjectCollection(projectKey, col)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                            isColActive
                              ? `${config.color} bg-slate-800/80 font-semibold border border-slate-700/60`
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                          }`}
                        >
                          <span className="flex items-center gap-2 capitalize">
                            {IconComponent && <IconComponent className="w-3.5 h-3.5 opacity-80" />}
                            {displayLabel}
                          </span>
                          {isColActive && <ChevronRight className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Settings Link */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setActiveTab('Settings')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
            activeTab === 'Settings'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-4 h-4 text-purple-400" />
          <span>DB Config & Settings</span>
        </button>
      </div>
    </aside>
  );
}
