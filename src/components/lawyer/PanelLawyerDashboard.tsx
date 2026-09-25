import React, { useState } from 'react';
import { LegalCase } from '../../types';
import { getStoredCases, saveCases } from '../../utils/storage';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  MapPin, 
  PhoneCall, 
  PlusCircle, 
  Scale, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Search, 
  User, 
  Upload, 
  X,
  History,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface PanelLawyerDashboardProps {
  currentLawyerName?: string;
}

export const PanelLawyerDashboard: React.FC<PanelLawyerDashboardProps> = ({
  currentLawyerName = 'অ্যাডভোকেট সুরাইয়া পারভীন (Advocate Suraiya Parveen)'
}) => {
  const [selectedLawyer, setSelectedLawyer] = useState<string>(currentLawyerName);
  const [cases, setCases] = useState<LegalCase[]>(getStoredCases());
  const [updatingCase, setUpdatingCase] = useState<LegalCase | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Submit Update Modal Form State
  const [updateStage, setUpdateStage] = useState('সাক্ষ্যগ্রহণ ও জবানবন্দি সম্পন্ন');
  const [nextHearingInput, setNextHearingInput] = useState('২৪ অক্টোবর ২০২৬ (বৃহস্পতিবার)');
  const [updateSummary, setUpdateSummary] = useState(
    'বিজ্ঞ আদালতে বাদী ও প্রধান প্রত্যক্ষদর্শীর জবানবন্দি রেকর্ড করা হয়েছে। পরবর্তী তারিখে জেরা ও আদেশের দিন ধার্য করা হয়েছে।'
  );
  const [hasFileAttached, setHasFileAttached] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reloadCases = () => {
    setCases(getStoredCases());
  };

  // Filter cases assigned to this lawyer (or fallback to related cases)
  const lawyerCases = cases.filter((c) => {
    if (!c.assignedLawyer) return false;
    const isMatched = c.assignedLawyer.toLowerCase().includes('সুরাইয়া') || 
                      c.assignedLawyer.toLowerCase().includes('suraiya') ||
                      c.assignedLawyer.toLowerCase().includes('মারজিনা') ||
                      c.assignedLawyer.toLowerCase().includes('marzina');
    
    if (selectedLawyer.includes('সুরাইয়া') || selectedLawyer.includes('Suraiya')) {
      return c.assignedLawyer.toLowerCase().includes('সুরাইয়া') || c.assignedLawyer.toLowerCase().includes('suraiya');
    }
    return c.assignedLawyer.toLowerCase().includes('মারজিনা') || c.assignedLawyer.toLowerCase().includes('marzina');
  });

  const filteredCases = lawyerCases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.provenance.subjectName.toLowerCase().includes(q) ||
      c.trackingNumber.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.policeStation.toLowerCase().includes(q)
    );
  });

  const handleOpenUpdateModal = (c: LegalCase) => {
    setUpdatingCase(c);
    setNextHearingInput(c.nextHearingDate || '২৫ অক্টোবর ২০২৬');
    setUpdateStage('শুনানি ও আদালতের অগ্রগতি দাখিল');
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingCase) return;

    const newUpdateRecord = {
      id: `up-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      stage: updateStage,
      summary: updateSummary,
      submittedBy: selectedLawyer,
    };

    const all = getStoredCases();
    const index = all.findIndex((c) => c.id === updatingCase.id);
    if (index !== -1) {
      const existingUpdates = all[index].lawyerUpdates || [];
      all[index] = {
        ...all[index],
        nextHearingDate: nextHearingInput,
        hearingStage: updateStage,
        isOverdue: false,
        lawyerUpdates: [newUpdateRecord, ...existingUpdates],
      };
      saveCases(all);
      reloadCases();
    }

    setToastMessage(`মামলা ${updatingCase.trackingNumber} এর আদালতের অগ্রগতি সফলভাবে ডিএলএও সিস্টেমে সাবমিট হয়েছে!`);
    setUpdatingCase(null);

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast message */}
      {toastMessage && (
        <div
          role="status"
          className="bg-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-semibold animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-emerald-200 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Panel Lawyer Profile */}
      <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg border border-emerald-400/40">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-700">
                  প্যানেল আইনজীবী পোর্টাল (Panel Lawyer View B5)
                </span>
                <span className="text-xs text-slate-400">বার কাউন্সিল নং: BD-BAR-19402</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {selectedLawyer}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                জেলা লিগ্যাল এইড কার্যালয়, ঢাকা জজ কোর্ট · সরকারি আইনগত সহায়তা আইনজীবী
              </p>
            </div>
          </div>

          {/* Lawyer Simulator Toggle for Testing */}
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 space-y-1.5 w-full sm:w-auto shrink-0">
            <span className="text-xs text-slate-400 block font-bold">আইনজীবী প্রোফাইল সুইচ (টেস্টিং):</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedLawyer('অ্যাডভোকেট সুরাইয়া পারভীন (Advocate Suraiya Parveen)')}
                className={`flex-1 sm:flex-none min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition text-center ${
                  selectedLawyer.includes('সুরাইয়া')
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                সুরাইয়া পারভীন (নিয়মিত)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLawyer('অ্যাডভোকেট মারজিনা বেগম (Advocate Marzina Begum)')}
                className={`flex-1 sm:flex-none min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition text-center ${
                  selectedLawyer.includes('মারজিনা')
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                মারজিনা বেগম (অ্যালার্ট প্রাপ্ত)
              </button>
            </div>
          </div>
        </div>

        {/* Lawyer Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] font-bold text-slate-400 uppercase">মোট সক্রিয় মামলা</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{lawyerCases.length}টি</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] font-bold text-slate-400 uppercase">আসন্ন শুনানি (এই মাসে)</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
              {lawyerCases.filter(c => c.nextHearingDate && !c.nextHearingDate.includes('অতিক্রান্ত')).length}টি
            </div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] font-bold text-slate-400 uppercase">অগ্রগতি আপডেট দাখিল</div>
            <div className="text-xl font-extrabold text-blue-400 mt-0.5">
              {lawyerCases.reduce((acc, c) => acc + (c.lawyerUpdates?.length || 0), 0)}টি
            </div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] font-bold text-slate-400 uppercase">সতর্কতা / পেন্ডিং</div>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5">
              {lawyerCases.filter(c => c.isOverdue).length}টি
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-700" />
          <span>আপনার অধীনস্থ মামলার তালিকা ({filteredCases.length}টি সক্রিয়)</span>
        </h3>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, ট্র্যাকিং নং বা থানা দিয়ে খুঁজুন..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Lawyer Active Cases Feed */}
      <div className="space-y-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 transition-colors space-y-4"
            >
              {/* Header row: Tracking + Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {c.trackingNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border">
                    {c.category}
                  </span>
                  {c.isOverdue && (
                    <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300 animate-pulse">
                      আপডেট মিসড
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ধার্য সময়: {c.timeAgo}</span>
                </div>
              </div>

              {/* Middle row: Subject details & Jurisdiction */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Client info */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">
                    বিচারপ্রার্থী নাগরিক / ক্লায়েন্ট
                  </span>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>{c.provenance.subjectName}</span>
                  </div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-slate-400" />
                    <span>{c.provenance.callerPhone}</span>
                  </div>
                  <div className="text-slate-500 truncate">
                    {c.provenance.subjectAddress}
                  </div>
                </div>

                {/* Court & Hearing details */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">
                    আদালতের এখতিয়ার ও পর্যায়
                  </span>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{c.hearingCourtName || `${c.policeStation}, ${c.district}`}</span>
                  </div>
                  <div className="text-emerald-800 font-semibold bg-emerald-50/70 p-1.5 rounded border border-emerald-100">
                    বর্তমান পর্যায়: {c.hearingStage || 'আইনজীবী নিয়োগ সম্পন্ন'}
                  </div>
                </div>

                {/* Next Hearing Date Display */}
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">
                    পরবর্তী শুনানির তারিখ (Next Hearing)
                  </span>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>{c.nextHearingDate || 'এখনো তারিখ ধার্য হয়নি'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {c.lawyerUpdates && c.lawyerUpdates.length > 0
                      ? `${c.lawyerUpdates.length}টি কোর্ট আপডেট ইতিমধ্যে সাবমিট হয়েছে`
                      : 'নতুন শুনানির আপডেট জমা দিন'}
                  </div>
                </div>
              </div>

              {/* Latest update preview if exists */}
              {c.lawyerUpdates && c.lawyerUpdates.length > 0 && (
                <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-950 font-bold">
                    <span className="flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-emerald-700" />
                      <span>সর্বশেষ দাখিলকৃত আপডেট ({c.lawyerUpdates[0].date})</span>
                    </span>
                    <span className="text-[11px] bg-white text-emerald-900 px-2 py-0.5 rounded font-mono border border-emerald-200">
                      {c.lawyerUpdates[0].stage}
                    </span>
                  </div>
                  <p className="text-slate-700 italic">
                    "{c.lawyerUpdates[0].summary}"
                  </p>
                </div>
              )}

              {/* Bottom Actions: Submit Update Button (Mandatory Requirement) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 border-t border-slate-100 gap-2.5">
                <span className="text-[11px] text-slate-500">
                  আদালতে গৃহীত পদক্ষেপ ও আদেশের কপি ডিএলএও বরাবর প্রেরণ করুন
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenUpdateModal(c)}
                  className="w-full sm:w-auto min-h-[44px] justify-center px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Update (অগ্রগতি সাবমিট)</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              কোনো মামলা পাওয়া যায়নি
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              নির্বাচিত আইনজীবী প্রোফাইলের অধীন এই মুহূর্তে কোনো মামলা নেই। ওপরের প্রোফাইল সুইচ থেকে সুরাইয়া পারভীন নির্বাচন করুন।
            </p>
          </div>
        )}
      </div>

      {/* Submit Update Modal */}
      {updatingCase && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="আদালতের অগ্রগতি রিপোর্ট দাখিল উইন্ডো"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92dvh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Submit Case Progress Update (B5)
                  </h4>
                  <p className="text-[11px] sm:text-xs text-emerald-200 font-mono">
                    {updatingCase.trackingNumber} — {updatingCase.provenance.subjectName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUpdatingCase(null)}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              {/* Stage Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আদালতে নিষ্পন্ন পদক্ষেপ / বর্তমান পর্যায়:
                </label>
                <select
                  value={updateStage}
                  onChange={(e) => setUpdateStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="সাক্ষ্যগ্রহণ ও জবানবন্দি সম্পন্ন">সাক্ষ্যগ্রহণ ও জবানবন্দি গ্রহণ সম্পন্ন</option>
                  <option value="আরজি ও ওকালতনামা দাখিল">আরজি ও ওকালতনামা দাখিল সম্পন্ন</option>
                  <option value="শুনানি অনুষ্ঠিত ও আদেশ স্থগিত">শুনানি অনুষ্ঠিত ও আদেশ স্থগিত</option>
                  <option value="জামিন আবেদন শুনানি সম্পন্ন">জামিন আবেদন শুনানি ও জামিন মঞ্জুর</option>
                  <option value="এডিআর আপসনামা আদালতে দাখিল">এডিআর আপসনামা আদালতে দাখিল</option>
                  <option value="চূড়ান্ত রায় ও ডিক্রি প্রদান">চূড়ান্ত রায় ও ডিক্রি প্রদান</option>
                </select>
              </div>

              {/* Next Hearing Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পরবর্তী শুনানির ধার্য তারিখ (Next Hearing Date):
                </label>
                <input
                  type="text"
                  required
                  value={nextHearingInput}
                  onChange={(e) => setNextHearingInput(e.target.value)}
                  placeholder="যেমন: ২৪ অক্টোবর ২০২৬ (বৃহস্পতিবার সকাল ১০:৩০)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              {/* Summary Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আদালতের কার্যক্রম ও আদেশের সংক্ষিপ্ত বিবরণ:
                </label>
                <textarea
                  rows={3}
                  required
                  value={updateSummary}
                  onChange={(e) => setUpdateSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-600 leading-relaxed"
                />
              </div>

              {/* Simulated Certified Copy Attachment */}
              <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-slate-700 font-medium">আদালতের হাজিরা স্লিপ / আদেশপত্রের ছবি</span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-emerald-800 font-bold bg-white px-2.5 py-1 rounded border border-slate-200 shrink-0">
                  <input
                    type="checkbox"
                    checked={hasFileAttached}
                    onChange={(e) => setHasFileAttached(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span>সংযুক্ত</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdatingCase(null)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center active:scale-95"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>সাবমিট করুন (Submit Update)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
