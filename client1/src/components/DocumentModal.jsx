import React, { useState, useEffect } from 'react';
import { X, Check, Save, Code, FileText, AlertTriangle } from 'lucide-react';

export default function DocumentModal({ mode, project, collection, initialData, onClose, onSave }) {
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState(null);
  const [formData, setFormData] = useState({});
  const [useRawJson, setUseRawJson] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setJsonText(JSON.stringify(initialData, null, 2));
    } else {
      const template = {
        name: "",
        email: "",
        phone: "",
        status: "Active",
        createdAt: new Date().toISOString()
      };
      setFormData(template);
      setJsonText(JSON.stringify(template, null, 2));
    }
  }, [initialData]);

  const handleJsonChange = (val) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setFormData(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  const handleFieldChange = (key, val) => {
    const updated = { ...formData, [key]: val };
    setFormData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (useRawJson && jsonError) return;
    setLoading(true);

    let payload = useRawJson ? JSON.parse(jsonText) : formData;
    await onSave(mode, project, collection, payload, initialData?._id);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              mode === 'view' ? 'bg-indigo-600/30 text-indigo-300' : mode === 'create' ? 'bg-emerald-600/30 text-emerald-300' : 'bg-amber-600/30 text-amber-300'
            }`}>
              {mode === 'view' ? 'VIEW' : mode === 'create' ? 'NEW' : 'EDIT'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white capitalize">
                {mode} Document • <span className="text-indigo-400">{collection}</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Project: {project} {initialData?._id && `| ID: ${initialData._id}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {mode !== 'view' && (
              <button
                type="button"
                onClick={() => setUseRawJson(!useRawJson)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                  useRawJson ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{useRawJson ? 'Form View' : 'Raw JSON'}</span>
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {mode === 'view' ? (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto">
                <pre>{JSON.stringify(formData, null, 2)}</pre>
              </div>
            </div>
          ) : useRawJson ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Edit JSON Document</label>
              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={14}
                className="w-full glass-input rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none"
              />
              {jsonError && (
                <div className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Invalid JSON: {jsonError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.keys(formData).map((key) => {
                if (key === '_id') return null;
                const val = formData[key];
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 capitalize font-mono">{key}</label>
                    <input
                      type="text"
                      value={typeof val === 'object' ? JSON.stringify(val) : val ?? ''}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          {mode !== 'view' && (
            <button
              onClick={handleSubmit}
              disabled={loading || (useRawJson && jsonError)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-indigo-600/30"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Document'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
