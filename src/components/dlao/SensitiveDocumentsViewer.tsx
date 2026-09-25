import React, { useState } from 'react';
import { LegalCase } from '../../types';
import { getStoredCases, saveCases } from '../../utils/storage';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  FileText, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  FileCheck2,
  AlertTriangle,
  Fingerprint,
  Send
} from 'lucide-react';

interface SensitiveDocumentsViewerProps {
  legalCase: LegalCase;
  onUpdateCase?: (updated: LegalCase) => void;
  className?: string;
}

export const SensitiveDocumentsViewer: React.FC<SensitiveDocumentsViewerProps> = ({
  legalCase,
  onUpdateCase,
  className = '',
}) => {
  // Simulator toggle for testing: Role B6 vs Sending DLAO / General Viewer
  const [currentViewerRole, setCurrentViewerRole] = useState<'sending_dlao' | 'receiving_dlao_b6'>(
    'sending_dlao'
  );

  const [isReceiptAcknowledged, setIsReceiptAcknowledged] = useState<boolean>(
    legalCase.isReceiptAcknowledged || false
  );
  const [revealedByB6, setRevealedByB6] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSensitive = legalCase.isSensitive || legalCase.category === 'Sensitive/Image Harassment';

  const documents = legalCase.evidenceFiles || [
    { name: 'নাবিলার_বিকৃত_ছবির_স্ক্রিনশট_প্রমাণক.png', type: 'image/png', size: '2.4 MB' },
    { name: 'হোয়াটসঅ্যাপ_ব্ল্যাকমেইল_চ্যাটলগ.pdf', type: 'application/pdf', size: '1.1 MB' },
    { name: 'সিআইডি_সাইবার_পুলিশ_জিডি_কপি.pdf', type: 'application/pdf', size: '480 KB' },
  ];

  // Acknowledge Receipt Handler for Receiving DLAO (Role B6)
  const handleAcknowledgeReceipt = () => {
    const timeStr = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ', ' +
      new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });

    const all = getStoredCases();
    const updatedCase: LegalCase = {
      ...legalCase,
      isReceiptAcknowledged: true,
      acknowledgedBy: 'Authorized Receiving DLAO - Special Cyber Cell (Role B6)',
      acknowledgedAt: timeStr,
      officerNotes: (legalCase.officerNotes || '') + `\n[Receipt Acknowledged]: Receiving DLAO (Role B6) কর্তৃক ${timeStr} এ নথিপত্র আনুষ্ঠানিকভাবে গৃহীত ও হেফাজত নিশ্চিত হয়েছে।`,
    };

    const idx = all.findIndex((c) => c.id === legalCase.id);
    if (idx !== -1) {
      all[idx] = updatedCase;
      saveCases(all);
    }

    setIsReceiptAcknowledged(true);
    setToastMessage('নথিপত্রের আনুষ্ঠানিক প্রাপ্তিস্বীকার সম্পন্ন হয়েছে! প্রেরণকারী ডিএলএও (Sending DLAO) ড্যাশবোর্ডে স্ট্যাটাস আপডেট প্রেরিত।');
    if (onUpdateCase) onUpdateCase(updatedCase);

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 ${className}`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          className="bg-emerald-700 text-white p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-emerald-200 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-emerald-700" />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-900">
                Documents & Evidence Section (নথিপত্র ও প্রমাণক)
              </h4>
              {isSensitive && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full">
                  Sensitive/Image Harassment
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              সংবেদনশীল মামলার ডিজিটাল প্রমাণকের নিরাপত্তা ও রোল-ভিত্তিক প্রবেশাধিকার।
            </p>
          </div>
        </div>

        {/* Viewer Role Switcher for Pitch Demonstration */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-600 pl-1 shrink-0">
            ভূমিকা সুইচ:
          </span>
          <button
            type="button"
            onClick={() => {
              setCurrentViewerRole('sending_dlao');
              setRevealedByB6(false);
            }}
            className={`flex-1 sm:flex-none min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold transition text-center ${
              currentViewerRole === 'sending_dlao'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sending DLAO
          </button>

          <button
            type="button"
            onClick={() => setCurrentViewerRole('receiving_dlao_b6')}
            className={`flex-1 sm:flex-none min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-black transition text-center ${
              currentViewerRole === 'receiving_dlao_b6'
                ? 'bg-purple-700 text-white shadow-2xs ring-1 ring-purple-500'
                : 'text-purple-800 hover:text-purple-950'
            }`}
          >
            Receiving DLAO (Role B6)
          </button>
        </div>
      </div>

      {/* Sending DLAO Status Bar - shows whether Receiving DLAO has acknowledged receipt */}
      <div className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
        isReceiptAcknowledged
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : 'bg-amber-50 border-amber-300 text-amber-950'
      }`}>
        <div className="flex items-center gap-2">
          {isReceiptAcknowledged ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          )}
          <span className="font-bold">
            {isReceiptAcknowledged
              ? 'প্রেরণকারী ডিএলএও স্ট্যাটাস: রিসিভিং ডিএলএও (Role B6) কর্তৃক প্রাপ্তিস্বীকার ও হেফাজত সম্পন্ন ✅'
              : 'প্রেরণকারী ডিএলএও স্ট্যাটাস: রিসিভিং ডিএলএও (Role B6) এর প্রাপ্তিস্বীকারের জন্য অপেক্ষমাণ...'}
          </span>
        </div>

        {isReceiptAcknowledged && legalCase.acknowledgedAt && (
          <span className="text-[11px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
            স্বীকৃতি সময়: {legalCase.acknowledgedAt}
          </span>
        )}
      </div>

      {/* 
        MANDATORY REQUIREMENT (Challenge A3):
        "For a case marked 'Sensitive/Image Harassment', blur out the document thumbnails entirely.
         Add an access control layer that says 'Access Restricted - Viewable only by Authorized Receiving DLAO (Role B6).'
         Ensure the 'Receiving DLAO' role has an 'Acknowledge Receipt' button that updates the status for the sending DLAO."
      */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {documents.map((doc, idx) => {
          const isBlurred = isSensitive && (!revealedByB6 || currentViewerRole !== 'receiving_dlao_b6');

          return (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-2xs group flex flex-col"
            >
              {/* Document Thumbnail Area */}
              <div className="relative h-40 bg-slate-200 flex items-center justify-center overflow-hidden">
                {/* Mock Thumbnail Content (Visibly blurred if sensitive) */}
                <div
                  className={`w-full h-full flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                    isBlurred ? 'filter blur-xl scale-110 brightness-50 select-none pointer-events-none' : ''
                  }`}
                >
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm border border-slate-300 p-2 flex flex-col justify-between">
                    <div className="w-full h-2 bg-red-400 rounded-sm mb-1" />
                    <div className="w-full space-y-1">
                      <div className="w-3/4 h-1 bg-slate-300 rounded-xs" />
                      <div className="w-full h-1 bg-slate-300 rounded-xs" />
                      <div className="w-2/3 h-1 bg-slate-300 rounded-xs" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-purple-200 mx-auto" />
                  </div>
                  <span className="text-[10px] text-slate-600 mt-2 font-mono">
                    {doc.name}
                  </span>
                </div>

                {/* ACCESS CONTROL RESTRICTION LAYER OVERLAY */}
                {isBlurred && (
                  <div
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center text-white space-y-2 z-10"
                    role="alert"
                    aria-label="নিরাপত্তা ব্লার সক্রিয়"
                  >
                    <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-400 text-red-400 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>

                    {/* EXACT MANDATORY SECURITY STRING */}
                    <div className="text-xs font-black text-red-300 uppercase tracking-wide leading-tight max-w-[200px]">
                      Access Restricted - Viewable only by Authorized Receiving DLAO (Role B6).
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      [সংবেদনশীল ছবি সম্পূর্ণ ব্লারকৃত]
                    </span>
                  </div>
                )}
              </div>

              {/* Document Meta row */}
              <div className="p-3 bg-white border-t border-slate-100 flex-1 flex flex-col justify-between">
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {doc.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    আকার: {doc.size} · ফরম্যাট: {doc.type}
                  </span>
                </div>

                {/* Inspect button if Role B6 has unlocked */}
                {currentViewerRole === 'receiving_dlao_b6' && revealedByB6 && (
                  <span className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded flex items-center justify-center gap-1 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Role B6 এর জন্য আনলকড</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 
        MANDATORY RECEIVING DLAO ACTION BAR:
        Ensure the 'Receiving DLAO' role has an 'Acknowledge Receipt' button that updates the status for the sending DLAO.
      */}
      {currentViewerRole === 'receiving_dlao_b6' ? (
        <div className="rounded-2xl border-2 border-purple-400 bg-purple-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
              <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                Authorized Receiving DLAO Console (Role B6)
              </span>
            </div>
            <p className="text-xs text-purple-900 leading-relaxed max-w-xl">
              আপনি অথোরাইজড রিসিভিং ডিএলএও হিসেবে লগইন করেছেন। প্রেরিত সংবেদনশীল নথিপত্র আনুষ্ঠানিকভাবে গ্রহণ করতে <strong>'Acknowledge Receipt'</strong> বাটনে চাপুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
            {/* Reveal/Inspect Toggle for Role B6 */}
            <button
              type="button"
              onClick={() => setRevealedByB6(!revealedByB6)}
              className="flex-1 sm:flex-none min-h-[44px] justify-center px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-300 transition flex items-center gap-1.5"
            >
              {revealedByB6 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{revealedByB6 ? 'ছবি ব্লার করুন' : 'তদন্তের জন্য প্রদর্শন'}</span>
            </button>

            {/* MANDATORY 'Acknowledge Receipt' BUTTON */}
            {!isReceiptAcknowledged ? (
              <button
                type="button"
                onClick={handleAcknowledgeReceipt}
                className="w-full sm:w-auto min-h-[44px] justify-center px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-black shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
                aria-label="সংবেদনশীল নথিপত্রের প্রাপ্তিস্বীকার সম্পন্ন করুন"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Acknowledge Receipt (প্রাপ্তিস্বীকার করুন)</span>
              </button>
            ) : (
              <span className="w-full sm:w-auto min-h-[44px] justify-center px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>স্বীকৃত (Receipt Acknowledged)</span>
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Sending DLAO guidance */
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            ℹ️ প্রেরণকারী ডিএলএও হিসেবে আপনি নথিপত্র সুরক্ষিত অবস্থায় প্রেরণ করেছেন। রিসিভিং ডিএলএও (Role B6) স্বীকৃতি দিলে স্ট্যাটাস নিশ্চিত হবে।
          </span>
          <button
            type="button"
            onClick={() => setCurrentViewerRole('receiving_dlao_b6')}
            className="text-purple-700 hover:underline font-bold shrink-0 self-start sm:self-auto"
          >
            Receiving DLAO হিসেবে পরীক্ষা করুন ➔
          </button>
        </div>
      )}
    </div>
  );
};
