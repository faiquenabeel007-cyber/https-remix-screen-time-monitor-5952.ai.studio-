import React, { useState } from 'react';
import { Cloud, Database, RefreshCw, Download, Upload, CheckCircle2, Lock, Wifi, WifiOff, FileCode2, ArrowRightLeft } from 'lucide-react';
import { SyncLogEntry } from '../types';

interface CloudSyncTabProps {
  syncLogs: SyncLogEntry[];
  onTriggerSync: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CloudSyncTab: React.FC<CloudSyncTabProps> = ({
  syncLogs,
  onTriggerSync,
  onExportBackup,
  onImportBackup,
  isOfflineSimulated,
  setIsOfflineSimulated,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onTriggerSync();
      setIsSyncing(false);
    }, 800);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportBackup(content);
          setImportSuccess(true);
          setTimeout(() => setImportSuccess(false), 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cross-Platform Cloud Storage & Sync Engine</h2>
              <p className="text-xs text-slate-400">
                Offline-first architecture, delta-sync protocols, and encrypted storage implementation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Offline Simulation Switch */}
            <button
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                isOfflineSimulated
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isOfflineSimulated ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              <span>{isOfflineSimulated ? 'Offline Mode (Queued)' : 'Online (Auto-Sync)'}</span>
            </button>

            {/* Manual Sync */}
            <button
              onClick={handleSyncClick}
              disabled={isSyncing || isOfflineSimulated}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Pushing Payload...' : 'Sync Cloud Now'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Screen Time Monitor uses an <strong>Offline-First Delta Sync Protocol</strong>. All app usage data is written immediately to fast local storage (IndexedDB / SQLite), encrypted client-side with AES-256-GCM, and flushed asynchronously to cross-platform cloud persistence when online.
        </p>
      </div>

      {/* Cloud Sync Simulator & Payload Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Live Sync Log Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              Live Cloud Sync Log Feed
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {syncLogs.length} events logged
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {syncLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-indigo-300">{log.action}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Device: <strong className="text-slate-200">{log.deviceId}</strong></span>
                  <span className="font-mono text-cyan-400">{log.bytesTransferred} bytes</span>
                </div>
                <div className="font-mono text-[10px] text-slate-500 truncate bg-slate-900 p-1 rounded border border-slate-800">
                  <Lock className="w-3 h-3 inline mr-1 text-emerald-400" />
                  Ciphertext: {log.ciphertextPreview}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Backup Export & Restore */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Encrypted Local Backup & Restore
            </h3>
            <p className="text-xs text-slate-400">Export or import your screen usage data and daily limits as a portable JSON file</p>
          </div>

          <div className="space-y-4">
            {/* Export JSON */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-xs text-white">Export Local Backup (.json)</div>
                <div className="text-[11px] text-slate-400">Download complete dataset with daily limits & usage logs</div>
              </div>
              <button
                onClick={onExportBackup}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow transition flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export File</span>
              </button>
            </div>

            {/* Import JSON */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div>
                <div className="font-semibold text-xs text-white">Import / Restore Backup File</div>
                <div className="text-[11px] text-slate-400">Select a previously exported JSON backup to restore statistics</div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium border border-slate-600 transition flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Choose JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>

                {importSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Restored Successfully!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Cross-Platform Cloud Storage Architecture Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-indigo-400" />
            Developer Implementation Blueprint: Cross-Platform Cloud Synchronization
          </h3>
          <p className="text-xs text-slate-400">How to implement secure, seamless multi-client cloud storage from scratch</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">1</span>
              Local Offline Database
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Store usage events in <strong>IndexedDB (Web)</strong>, <strong>Room (Android)</strong>, and <strong>CoreData / SwiftData (iOS)</strong>. Every screen unlock or app shift creates an append-only transaction log.
            </p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">2</span>
              Conflict Resolution (CRDTs)
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Use <strong>State Vector Clocks or CRDTs (Conflict-free Replicated Data Types)</strong> to resolve out-of-order usage uploads across devices without losing daily minutes or overwriting limit caps.
            </p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">3</span>
              Firebase / Cloud SQL Backend
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Deploy a server-side API or Cloud Firestore collection keyed by encrypted user ID. Firebase real-time listeners automatically notify idle devices when a new limit is set.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
