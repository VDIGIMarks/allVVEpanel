import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import DatabaseBrowser from './components/DatabaseBrowser';
import DocumentModal from './components/DocumentModal';
import UnifiedSearch from './components/UnifiedSearch';
import Settings from './components/Settings';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

import { getApiUrl } from './config/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedCollection, setSelectedCollection] = useState('users');
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view', // 'view' | 'create' | 'edit'
    project: 'Echo',
    collection: 'properties',
    initialData: null
  });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch overall health and database stats
  const fetchHealthAndStats = async () => {
    try {
      const res = await fetch(getApiUrl('/api/health'));
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setHealth(data.health);
      }
    } catch (err) {
      console.error('Fetch health error:', err);
    }
  };

  useEffect(() => {
    fetchHealthAndStats();
  }, []);

  // Keyboard shortcut Ctrl+K for global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('Search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Modal actions
  const handleOpenCreate = (project, collection) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      project,
      collection,
      initialData: null
    });
  };

  const handleOpenView = (doc) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      project: activeTab,
      collection: selectedCollection,
      initialData: doc
    });
  };

  const handleOpenEdit = (project, collection, doc) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      project,
      collection,
      initialData: doc
    });
  };

  const handleSaveDocument = async (mode, project, collection, payload, id) => {
    try {
      let url = getApiUrl(`/api/${project}/collections/${collection}/documents`);
      let method = 'POST';
      if (mode === 'edit') {
        url = getApiUrl(`/api/${project}/collections/${collection}/documents/${id}`);
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Document ${mode === 'create' ? 'created' : 'updated'} successfully!`, 'success');
        fetchHealthAndStats();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (err) {
      showToast(`Save document error: ${err.message}`, 'error');
    }
  };

  const handleDeleteDocument = async (project, collection, id, reloadFn) => {
    if (!window.confirm(`Are you sure you want to delete record ${id}?`)) return;
    try {
      const res = await fetch(getApiUrl(`/api/${project}/collections/${collection}/documents/${id}`), {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('Document deleted successfully!', 'success');
        if (reloadFn) reloadFn();
        fetchHealthAndStats();
      } else {
        showToast(`Delete failed: ${data.error}`, 'error');
      }
    } catch (err) {
      showToast(`Delete error: ${err.message}`, 'error');
    }
  };

  const handleNavigateToDoc = (project, collection, doc) => {
    setActiveTab(project);
    setSelectedCollection(collection);
    handleOpenView(doc);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Header */}
      <Header
        health={health}
        onRefreshHealth={fetchHealthAndStats}
        onOpenSearch={() => setActiveTab('Search')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body with Sidebar + View */}
      <div className="flex-1 flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
          health={health}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'Overview' && (
            <Overview
              stats={stats}
              health={health}
              onSelectCollection={(p, c) => {
                setActiveTab(p);
                setSelectedCollection(c);
              }}
              onRefresh={fetchHealthAndStats}
            />
          )}

          {['Velzano', 'Echo', 'VDM'].includes(activeTab) && (
            <DatabaseBrowser
              project={activeTab}
              collection={selectedCollection}
              onSelectCollection={setSelectedCollection}
              onOpenCreate={handleOpenCreate}
              onOpenView={handleOpenView}
              onOpenEdit={handleOpenEdit}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'Search' && (
            <UnifiedSearch onNavigateToDoc={handleNavigateToDoc} />
          )}

          {activeTab === 'Settings' && (
            <Settings
              health={health}
              onRefreshHealth={fetchHealthAndStats}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Document View/Edit/Create Modal */}
      {modalState.isOpen && (
        <DocumentModal
          mode={modalState.mode}
          project={modalState.project}
          collection={modalState.collection}
          initialData={modalState.initialData}
          onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
          onSave={handleSaveDocument}
        />
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className={`px-4 py-3 rounded-xl border shadow-2xl flex items-center space-x-3 text-xs font-semibold backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
              : toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-800'
              : 'bg-slate-900/90 text-indigo-300 border-indigo-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
