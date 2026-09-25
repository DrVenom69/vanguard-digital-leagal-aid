import React, { useState } from 'react';
import { LegalCase } from '../../types';
import { ProvenanceHeader } from './ProvenanceHeader';
import { JurisdictionReferralFlow } from './JurisdictionReferralFlow';
import { SensitiveDocumentsViewer } from './SensitiveDocumentsViewer';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Scale, 
  PhoneCall, 
  MapPin, 
  FileText, 
  Mic, 
  Play, 
  Pause, 
  Send, 
  CheckCircle2, 
  AlertOctagon,
  Clock,
  Printer,
  Share2
} from 'lucide-react';
import { getStoredCases, saveCases } from '../../utils/storage';

interface CaseDetailModalProps {
  legalCase: LegalCase | null;
  onClose: () => void;
  onUpdateCase?: (updated: LegalCase) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  legalCase,
  onClose,
  onUpdateCase,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [assignedLawyerInput, setAssignedLawyerInput] = useState(
    legalCase?.assignedLawyer || ''
  );
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  if (!legalCase) return null;

  const handleAssignLawyer = () => {
    const lawyerName = assignedLawyerInput.trim() || 'অ্যাডভোকেট মোঃ দেলোয়ার হোসেন (প্যানেল আইনজীবী)';
    const updated: LegalCase = {
      ...legalCase,
      assignedLawyer: lawyerName,
      status: 'lawyer_assigned',
    };
    saveSingleCase(updated);
    setActionSuccessMessage(`প্যানেল আইনজীবী নিয়োগ সম্পন্ন: ${lawyerName}`);
  };

  const handleScheduleADR = () => {
    const adrDate = '১০ অক্টোবর ২০২৬, সকাল ১১:০০ টা';
    const updated: LegalCase = {
      ...legalCase,
      adrDate,
      status: 'adr_scheduled',
    };
    saveSingleCase(updated);
    setActionSuccessMessage(`এডিআর (ADR) মধ্যস্থতার নোটিশ জারি ও তারিখ নির্ধারিত: ${adrDate}`);
  };

  const handleEmergencyPoliceAlert = () => {
    const updated: LegalCase = {
      ...legalCase,
      priority: 'urgent',
      officerNotes: (legalCase.officerNotes || '') + '\n[জরুরি সতর্কতা]: ৯৯৯ ও সংশ্লিষ্ট ওসির নিকট জরুরি মেসেজ প্রেরিত।',
    };
    saveSingleCase(updated);
    setActionSuccessMessage(`জরুরি পুলিশ প্রটেকশন রিকোয়েস্ট প্রেরিত: ${legalCase.policeStation}`);
  };

  const handleVerifySubject = () => {
    const updated: LegalCase = {
      ...legalCase,
      provenance: {
        ...legalCase.provenance,
        subjectVerification: 'verified',
      },
    };
    saveSingleCase(updated);
    setActionSuccessMessage(`ভুক্তভোগীর পরিচয় সফলভাবে যাচাইকৃত চিহ্নিত হয়েছে।`);
  };

  const saveSingleCase = (updated: LegalCase) => {
    const all = getStoredCases();
    const index = all.findIndex((c) => c.id === updated.id);
    if (index !== -1) {
      all[index] = updated;
      saveCases(all);
    }
    if (onUpdateCase) onUpdateCase(updated);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex justify-end transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="মামলার পূর্ণাঙ্গ ডসিয়ার ও প্রমাণক তথ্য"
    >
      {/* Backdrop overlay dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Slide-out Panel */}
      <div className="relative w-full sm:max-w-3xl bg-white min-h-[100dvh] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header toolbar with safe area */}
        <div 
          className="sticky top-0 z-20 bg-slate-900 text-white px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 0.75rem)' }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-emerald-400">
                  মামলা কেস নথি (Dossier)
                </span>
                <span className="font-mono text-[11px] sm:text-xs bg-slate-800 px-1.5 py-0.2 rounded text-slate-300 font-bold">
                  {legalCase.trackingNumber}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {legalCase.provenance.subjectName} — {legalCase.category}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
              title="প্রিন্ট করুন"
              aria-label="কেস নথি প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95"
              aria-label="প্যানেল বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast alert */}
        {actionSuccessMessage && (
          <div
            role="status"
            className="bg-emerald-600 text-white px-5 py-3 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-inner"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-100 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* VIEW 2 REQUIREMENT: Case Detail Header (Provenance Master Component) */}
          <section aria-label="প্রোভেন্যান্স মাস্টার কম্পোনেন্ট">
            <ProvenanceHeader
              provenance={legalCase.provenance}
              trackingNumber={legalCase.trackingNumber}
            />
          </section>

          {/* AI Decision Support & Triage Assessment */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>এআই ট্রায়াজ ও স্বয়ংক্রিয় ঝুঁকি মূল্যায়ন (AI Triage Score)</span>
              </div>
              {legalCase.aiConfidenceScore && (
                <span className="text-xs font-mono font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  নির্ভুলতা স্কোর: {legalCase.aiConfidenceScore}%
                </span>
              )}
            </div>
            <div className="mt-3 space-y-2">
              <div className="text-sm font-semibold text-slate-800">
                {legalCase.aiSummary}
              </div>
              {legalCase.aiSuggestedAction && (
                <div className="text-xs text-emerald-900 bg-white/80 p-2.5 rounded-xl border border-emerald-200 leading-relaxed">
                  <strong>সুপারিশকৃত সরকারি প্রতিকার: </strong>
                  {legalCase.aiSuggestedAction}
                </div>
              )}
            </div>
          </div>

          {/* Incident Description (Text-Heavy Form Content) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>ঘটনার বিস্তারিত বর্ণনা (Full Text Allegations):</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {legalCase.incidentDescription}
            </p>
          </div>

          {/* Desired Relief & Jurisdiction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                প্রার্থিত আইনি প্রতিকার (Desired Relief)
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {legalCase.desiredRelief}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                আইনি এখতিয়ার ও থানা (Police Jurisdiction)
              </div>
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span>{legalCase.policeStation}, {legalCase.district}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ইউনিয়ন: {legalCase.unionParishad || 'ইউডিসি অধিক্ষেত্র'}
              </p>
            </div>
          </div>

          {/* Voice Note Recording Audio Player Mockup (for UDC/Illiterate callers) */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Mic className="w-4 h-4 text-blue-700" />
                <span>মৌখিক জবানবন্দি / ভয়েস অডিও রেকর্ড (UDC Voice Memo)</span>
              </div>
              <span className="text-xs font-mono text-blue-700 font-semibold">
                দৈর্ঘ্য: {legalCase.audioDuration || '০১:৩২ মিনিট'}
              </span>
            </div>

            {/* Audio Waveform Player Simulation */}
            <div className="bg-white p-3 rounded-xl border border-blue-200 flex items-center gap-3">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition"
                aria-label={isPlayingAudio ? 'অডিও থামান' : 'অডিও শুনুন'}
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div className="flex-1">
                {/* Waveform bars */}
                <div className="flex items-center gap-1 h-8">
                  {[24, 45, 60, 30, 80, 50, 95, 40, 70, 85, 30, 65, 90, 45, 30, 55, 75, 40, 60, 85, 30, 50].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-full transition-all ${
                        isPlayingAudio && i % 3 === 0
                          ? 'bg-blue-600 animate-pulse'
                          : 'bg-blue-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>{isPlayingAudio ? 'চলছে: ০০:১৮' : '০০:০০'}</span>
                  <span>{legalCase.audioDuration || '০১:৩২'}</span>
                </div>
              </div>
            </div>

            {/* Bengali Speech-to-Text Transcription */}
            {legalCase.audioTranscript && (
              <div className="bg-white/90 p-3 rounded-xl border border-blue-100 text-xs text-slate-700">
                <span className="font-bold text-blue-950">স্বয়ংক্রিয় বাংলা রূপান্তর (ASR): </span>
                <span className="italic font-serif">"{legalCase.audioTranscript}"</span>
              </div>
            )}
          </div>

          {/* Challenge T2: Jurisdiction Escalation & Ping-Pong Referral Flow */}
          {(legalCase.referralHistory || legalCase.pingPongBouncesCount || legalCase.category === 'Sensitive/Image Harassment') && (
            <JurisdictionReferralFlow
              legalCase={legalCase}
              onUpdateCase={onUpdateCase}
            />
          )}

          {/* Challenge A3: Documents & Evidence Section with Sensitive Access Rules */}
          <SensitiveDocumentsViewer
            legalCase={legalCase}
            onUpdateCase={onUpdateCase}
          />

          {/* Legal Aid Status & Assigned Lawyer Display */}
          {legalCase.assignedLawyer && (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-800 font-semibold">নিযুক্ত সরকারি আইনজীবী:</div>
                  <div className="text-sm font-bold text-emerald-950">{legalCase.assignedLawyer}</div>
                </div>
              </div>
              <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-3 py-1 rounded-full border border-emerald-400">
                মামলা চলমান
              </span>
            </div>
          )}

          {legalCase.adrDate && (
            <div className="rounded-2xl border border-blue-300 bg-blue-50/80 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-blue-800 font-semibold">এডিআর মধ্যস্থতা বৈঠক:</div>
                  <div className="text-sm font-bold text-blue-950">{legalCase.adrDate}</div>
                </div>
              </div>
              <span className="text-xs bg-blue-200 text-blue-900 font-bold px-3 py-1 rounded-full border border-blue-400">
                নোটিশ জারি
              </span>
            </div>
          )}

          {/* DLAO Action Form */}
          <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 text-white p-5 space-y-4">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>DLAO প্রশাসনিক অ্যাকশন গ্রহণ (Take Triage Action)</span>
            </h4>

            {/* Assign Panel Lawyer Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                প্যানেল আইনজীবী নিয়োগ করুন (বা ডিফল্ট নির্বাচন করুন):
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={assignedLawyerInput}
                  onChange={(e) => setAssignedLawyerInput(e.target.value)}
                  placeholder="যেমন: অ্যাডভোকেট সৈয়দ নাসির উদ্দীন (প্যানেল নং-০৪)"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  onClick={handleAssignLawyer}
                  className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>আইনজীবী নিযুক্ত</span>
                </button>
              </div>
            </div>

            {/* Quick action buttons grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={handleScheduleADR}
                className="min-h-[44px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-300 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>এডিআর / মধ্যস্থতা তলব</span>
              </button>

              <button
                onClick={handleEmergencyPoliceAlert}
                className="min-h-[44px] bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>জরুরি ৯৯৯ / থানা সংযোগ</span>
              </button>

              <button
                onClick={handleVerifySubject}
                className="min-h-[44px] bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>পরিচয় যাচাই নিশ্চিত</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions with safe-area support */}
        <div 
          className="sticky bottom-0 bg-slate-100 border-t border-slate-200 px-4 sm:px-5 py-3 flex items-center justify-between"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.75rem)' }}
        >
          <span className="text-xs text-slate-500">
            শেষ হালনাগাদ: {legalCase.timeAgo}
          </span>
          <button
            onClick={onClose}
            className="min-h-[40px] px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold transition active:scale-95"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
