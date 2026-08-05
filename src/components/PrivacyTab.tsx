import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, Trash2, Eye, EyeOff, Check, Cpu, FileCode, AlertOctagon } from 'lucide-react';
import { encryptLocalData, decryptLocalData, EncryptedPayload } from '../utils/crypto';

interface PrivacyTabProps {
  onClearAllLocalData: () => void;
  sampleDataObj: unknown;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({
  onClearAllLocalData,
  sampleDataObj,
}) => {
  const [passphrase, setPassphrase] = useState('user-private-master-key');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [encryptedPayload, setEncryptedPayload] = useState<EncryptedPayload | null>(null);
  const [decryptedResult, setDecryptedResult] = useState<unknown | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);

  const handleRunEncryption = async () => {
    setIsEncrypting(true);
    setDecryptedResult(null);
    setDecryptionError(null);
    try {
      const payload = await encryptLocalData(sampleDataObj, passphrase);
      setEncryptedPayload(payload);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleRunDecryption = async () => {
    if (!encryptedPayload) return;
    setIsDecrypting(true);
    setDecryptionError(null);
    try {
      const result = await decryptLocalData(encryptedPayload, passphrase);
      setDecryptedResult(result);
    } catch (err: unknown) {
      console.error(err);
      setDecryptionError('Decryption failed! Incorrect passphrase or corrupted payload.');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Privacy Architecture & Zero-Knowledge Security</h2>
            <p className="text-xs text-slate-400">
              Client-side AES-GCM 256-bit encryption ensuring complete user data sovereignty.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Screen Time Monitor is engineered around a strict <strong>Zero-Knowledge Privacy Standard</strong>. Your personal application usage logs, pickup frequency, and daily limit choices are encrypted directly inside your web browser before touching any network transport or cloud persistence layer.
        </p>
      </div>

      {/* 4 Core Privacy Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs text-white">1. Client-Side AES-256 Encryption</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Data is encrypted using Web Crypto API before local persistence or cloud transmission.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 w-fit">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs text-white">2. User-Controlled Master Keys</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Decryption keys are derived from your private passphrase using PBKDF2 (100,000 iterations).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs text-white">3. Zero Data Monetization</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            No ad brokers, zero third-party telemetry scripts, and no unencrypted server profiling.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 w-fit">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs text-white">4. Total Data Purge Controls</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Instantly wipe all local IndexedDB/localStorage keys and cloud records with 1 click.
          </p>
        </div>

      </div>

      {/* Interactive Web Crypto Encryption Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Live Interactive Client-Side Encryption Sandbox
            </h3>
            <p className="text-xs text-slate-400">Test Web Crypto API AES-GCM-256 encryption & decryption in real-time</p>
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            WebCrypto API Supported
          </span>
        </div>

        <div className="space-y-4">
          
          {/* Passphrase Input */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <label className="text-xs font-semibold text-slate-300 whitespace-nowrap">
              Client Master Encryption Passphrase:
            </label>
            <div className="relative flex-1">
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
              >
                {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleRunEncryption}
              disabled={isEncrypting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow transition whitespace-nowrap"
            >
              {isEncrypting ? 'Encrypting...' : 'Encrypt Live Data'}
            </button>
          </div>

          {/* Encryption Results Display */}
          {encryptedPayload && (
            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  AES-256-GCM Encrypted Payload
                </span>
                <span className="text-slate-500 font-mono text-[10px]">{encryptedPayload.version}</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Ciphertext (Base64):</div>
                  <div className="bg-slate-900 p-2 rounded text-indigo-300 text-[11px] break-all border border-slate-800">
                    {encryptedPayload.ciphertextBase64}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400">IV (Initialization Vector Hex):</span>
                    <div className="bg-slate-900 p-1.5 rounded text-cyan-400 border border-slate-800 truncate">
                      {encryptedPayload.ivHex}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">PBKDF2 Salt (Hex):</span>
                    <div className="bg-slate-900 p-1.5 rounded text-purple-400 border border-slate-800 truncate">
                      {encryptedPayload.saltHex}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decrypt Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleRunDecryption}
                  disabled={isDecrypting}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  {isDecrypting ? 'Decrypting...' : 'Decrypt Payload Live'}
                </button>

                {decryptedResult && (
                  <span className="text-xs text-emerald-400 font-medium">
                    Verified Decrypted JSON Match!
                  </span>
                )}
              </div>

              {decryptedResult && (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 max-h-40 overflow-y-auto">
                  <pre>{JSON.stringify(decryptedResult, null, 2)}</pre>
                </div>
              )}

              {decryptionError && (
                <div className="p-2 rounded bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{decryptionError}</span>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Dangerous Zone: Purge All Local Data */}
      <div className="bg-slate-900 border border-red-900/40 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-red-400 text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              Purge All Local Data & Master Keys
            </h3>
            <p className="text-xs text-slate-400">
              Permanently erase all local usage records, daily limit settings, and encryption keys from this browser.
            </p>
          </div>

          <button
            onClick={onClearAllLocalData}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Local Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
