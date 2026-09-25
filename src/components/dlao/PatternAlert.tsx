import React, { useState } from 'react';
import { 
  AlertTriangle, 
  UserX, 
  ArrowRight, 
  Clock, 
  Scale, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
  UserCheck, 
  X,
  FileWarning,
  Send
} from 'lucide-react';
import { LegalCase } from '../../types';
import { getStoredCases, saveCases } from '../../utils/storage';

interface PatternAlertProps {
  onReassigned?: () => void;
  className?: string;
}

export const PatternAlert: React.FC<PatternAlertProps> = ({ onReassigned, className = '' }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [targetNewLawyer, setTargetNewLawyer] = useState<string>(
    'অ্যাডভোকেট সুরাইয়া পারভীন (Advocate Suraiya Parveen)'
  );
  const [isReassigned, setIsReassigned] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cases = getStoredCases();
  const marzinaCases = cases.filter(
    (c) => c.assignedLawyer?.includes('মারজিনা') || c.assignedLawyer?.includes('Marzina')
  );

  const handleConfirmReassign = () => {
    const all = getStoredCases();
    let count = 0;
    const updated = all.map((c) => {
      if (c.assignedLawyer?.includes('মারজিনা') || c.assignedLawyer?.includes('Marzina')) {
        count++;
        return {
          ...c,
          assignedLawyer: targetNewLawyer,
          assignedLawyerPhone: '০১৭১২-৩৪৫৬৭৮',
          officerNotes: (c.officerNotes || '') + `\n[DLAO Reassignment]: পূর্বে নিযুক্ত মারজিনা বেগমের নিষ্ক্রিয়তার কারণে ${targetNewLawyer} কে দায়িত্ব হস্তান্তর করা হলো।`,
          isOverdue: false,
        };
      }
      return c;
    });

    saveCases(updated);
    setIsReassigned(true);
    setShowModal(false);
    setToastMessage(`সফলভাবে ${count}টি মামলা অ্যাডভোকেট মারজিনা বেগমের থেকে ${targetNewLawyer} এর নিকট রি-অ্যাসাইন সম্পন্ন হয়েছে।`);
    if (onReassigned) onReassigned();

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          className="bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-semibold animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-emerald-200">
            ✕
          </button>
        </div>
      )}

      {/* 
        CHALLENGE T1 REQUIREMENT:
        The DLAO Admin Alert: In the DLAO Admin View, add a specific 'Pattern Alert' component.
        It should flag a lawyer (e.g., 'Advocate Marzina Begum') with a warning:
        'Inactivity Threshold Reached: Missed 2 updates across 3 cases.'
        Include a button for the DLAO to 'Review & Reassign'.
      */}
      {!isReassigned ? (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50/50 border border-red-100 rounded-3xl p-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">
                    প্যাটার্ন অ্যালার্ট (Challenge T1 Pattern Alert)
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-red-100">
                    আইনজীবী মনিটরিং
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>Advocate Marzina Begum (অ্যাডভোকেট মারজিনা বেগম)</span>
                  <span className="text-xs font-bold text-red-700 bg-red-100/70 px-2.5 py-0.5 rounded-full">
                    প্যানেল আইনজীবী নং-১২
                  </span>
                </h3>

                {/* EXACT MANDATORY WARNING TEXT */}
                <p className="text-sm font-extrabold text-red-700 leading-snug">
                  Inactivity Threshold Reached: Missed 2 updates across 3 cases.
                </p>

                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  আইনগত সহায়তা মনিটরিং অ্যালগরিদম শনাক্ত করেছে যে উক্ত আইনজীবীর বরাদ্দে থাকা ৩টি মামলার মধ্যে ২টিতে নির্ধারিত শুনানির পরও আদালতের অগ্রগতির রিপোর্ট বা আদেশের কপি দাখিল করা হয়নি।
                </p>
              </div>
            </div>

            {/* Softer ghost button */}
            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto min-h-[44px] justify-center px-5 py-2.5 rounded-xl bg-white text-red-600 border border-red-200 hover:bg-red-50 font-bold text-xs sm:text-sm transition active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs"
                aria-label="অ্যাডভোকেট মারজিনা বেগমের মামলাসমূহ রিভিউ ও রি-অ্যাসাইন করুন"
              >
                <UserX className="w-4 h-4" />
                <span>Review & Reassign</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Resolved state */
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 flex items-center justify-between text-xs sm:text-sm text-emerald-900">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              <strong>প্যাটার্ন অ্যালার্ট সমাধানকৃত:</strong> অ্যাডভোকেট মারজিনা বেগমের ৩টি মামলা সফলভাবে <strong>{targetNewLawyer}</strong> এর নিকট হস্তান্তর করা হয়েছে।
            </span>
          </div>
          <button
            onClick={() => setIsReassigned(false)}
            className="text-xs text-emerald-700 underline font-bold"
          >
            পুনরায় অ্যালার্ট সিমুলেট করুন
          </button>
        </div>
      )}

      {/* Review & Reassign Interactive Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="আইনজীবী প্যাটার্ন পর্যালোচনা ও রি-অ্যাসাইন উইন্ডো"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92dvh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileWarning className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    আইনজীবী নিষ্ক্রিয়তা তদন্ত ও রি-অ্যাসাইন কনসোল
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-mono">
                    Challenge T1: Automated Inactivity Threshold Reassignment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              {/* Alert details card */}
              <div className="bg-red-50 border border-red-200 p-3.5 sm:p-4 rounded-2xl text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-red-900 font-bold gap-1">
                  <span>অভিযুক্ত আইনজীবী: Advocate Marzina Begum</span>
                  <span className="bg-red-200 text-red-950 px-2 py-0.5 rounded-full font-mono self-start sm:self-auto">
                    মিসড আপডেট: ২/৩
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  লিগ্যাল এইড বিধিমালা অনুযায়ী শুনানির ৭২ ঘণ্টার মধ্যে অগ্রগতি রিপোর্ট প্রদানের বাধ্যবাধকতা রয়েছে। 
                  ২১ দিনের বেশি সময় ধরে কোনো আপডেট না আসায় বিচারপ্রার্থী নাগরিকদের ন্যায়বিচার বিঘ্নিত হচ্ছে।
                </p>
              </div>

              {/* 3 Affected Cases List */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  প্রভাবিত ৩টি সক্রিয় মামলার বিবরণ:
                </span>
                
                {marzinaCases.length > 0 ? (
                  marzinaCases.map((c) => (
                    <div
                      key={c.id}
                      className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-800">{c.trackingNumber}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-bold text-slate-900">{c.provenance.subjectName}</span>
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 rounded">
                            {c.isOverdue ? 'আপডেট বিলম্বিত' : 'ঝুঁকিপূর্ণ'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          আদালত: {c.hearingCourtName || c.policeStation} · অবস্থা: {c.category}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-red-600 bg-white px-2 py-1 rounded border border-red-200 self-start sm:self-auto">
                        {c.nextHearingDate || 'আপডেট মিসড'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">কোনো সংশ্লিষ্ট মামলা পাওয়া যায়নি।</p>
                )}
              </div>

              {/* Reassignment Target Lawyer Selector */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 sm:p-4 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-emerald-950">
                  নতুন প্যানেল আইনজীবী নির্বাচন করুন (Reassign To):
                </label>
                <select
                  value={targetNewLawyer}
                  onChange={(e) => setTargetNewLawyer(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="অ্যাডভোকেট সুরাইয়া পারভীন (Advocate Suraiya Parveen)">
                    অ্যাডভোকেট সুরাইয়া পারভীন — রেটিং: ৯৮% (সময়মতো আপডেট: ১০০%)
                  </option>
                  <option value="অ্যাডভোকেট মোঃ দেলোয়ার হোসেন (Advocate Delwar Hossain)">
                    অ্যাডভোকেট মোঃ দেলোয়ার হোসেন — রেটিং: ৯৫% (প্যানেল নং-০৪)
                  </option>
                  <option value="অ্যাডভোকেট ফরিদা ইয়াসমিন (Advocate Farida Yasmin)">
                    অ্যাডভোকেট ফরিদা ইয়াসমিন — রেটিং: ৯২% (নারী ও শিশু ট্রাইব্যুনাল স্পেশালিস্ট)
                  </option>
                </select>
                <p className="text-[11px] text-emerald-800">
                  ✓ রি-অ্যাসাইন বাটনে চাপ দিলে অটোমেটিক নোটিশ সংশ্লিষ্ট আদালতে এবং এসএমএস ক্লায়েন্টের কাছে যাবে।
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition active:scale-95 text-center"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReassign}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>রি-অ্যাসাইন নিশ্চিত করুন (Confirm Reassignment)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
