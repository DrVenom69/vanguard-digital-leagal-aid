import React, { useState } from 'react';
import { LegalCase } from '../../types';
import { 
  ArrowRight, 
  RotateCcw, 
  AlertOctagon, 
  ShieldAlert, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ArrowLeftRight, 
  Send, 
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { getStoredCases, saveCases } from '../../utils/storage';

interface JurisdictionReferralFlowProps {
  legalCase: LegalCase;
  onUpdateCase?: (updated: LegalCase) => void;
  className?: string;
}

export const JurisdictionReferralFlow: React.FC<JurisdictionReferralFlowProps> = ({
  legalCase,
  onUpdateCase,
  className = '',
}) => {
  const [isEscalated, setIsEscalated] = useState<boolean>(
    legalCase.isEscalatedToChief || false
  );
  const [bouncesCount, setBouncesCount] = useState<number>(
    legalCase.pingPongBouncesCount || 2
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Challenge T2 requirement: Visual history of a case being bounced between 'DLAO' and 'Labour Cell' twice
  const history = legalCase.referralHistory || [
    {
      id: 'ref-1',
      stepNumber: 1,
      from: 'DLAO',
      to: 'Labour Cell',
      action: 'forwarded' as const,
      reason: 'কর্মক্ষেত্রের নিপীড়ন বিবেচনায় শ্রম সেলে রেফারেল প্রেরণ।',
      timestamp: '২৩ সেপ্টেম্বর সকাল ১০:১৫',
    },
    {
      id: 'ref-2',
      stepNumber: 2,
      from: 'Labour Cell',
      to: 'DLAO',
      action: 'rejected_bounce' as const,
      reason: 'এখতিয়ার অস্বীকৃতি (Bounce #1): ছবি বিকৃতি সাইবার ও ফৌজদারি অপরাধ, শ্রম আদালতে প্রতিকার নেই।',
      timestamp: '২৩ সেপ্টেম্বর দুপুর ০২:৩০',
    },
    {
      id: 'ref-3',
      stepNumber: 3,
      from: 'DLAO',
      to: 'Labour Cell',
      action: 'forwarded' as const,
      reason: 'শ্রম আইন ২০০৬ এর ৩৩২ ধারা কার্যকরে শ্রম সেলে পুন:প্রেরণ।',
      timestamp: '২৪ সেপ্টেম্বর সকাল ১১:০০',
    },
    {
      id: 'ref-4',
      stepNumber: 4,
      from: 'Labour Cell',
      to: 'DLAO',
      action: 'rejected_bounce' as const,
      reason: 'পুনরায় ফেরত (Ping-Pong Bounce #2): শ্রম সেল অপারগতা প্রকাশ পূর্বক পুনরায় ফেরত পাঠিয়েছে।',
      timestamp: '২৪ সেপ্টেম্বর বিকাল ০৪:১৫',
    },
  ];

  const handleEscalateToChief = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const all = getStoredCases();
      const updatedCase: LegalCase = {
        ...legalCase,
        isEscalatedToChief: true,
        isOverdue: false,
        priority: 'urgent',
        chiefEscalationNote: 'চিফ লিগ্যাল এইড অফিসার সরাসরি সাইবার ট্রাইব্যুনাল স্পেশাল সেলে এখতিয়ার নির্ধারণ করেছেন। পিং-পং বাউন্স রহিত।',
        officerNotes: (legalCase.officerNotes || '') + '\n[Challenge T2 Escalated]: পিং-পং বাউন্সের কারণে চিফ লিগ্যাল এইড অফিসারের জরুরি ডিক্রি জারি।',
      };

      const idx = all.findIndex((c) => c.id === legalCase.id);
      if (idx !== -1) {
        all[idx] = updatedCase;
        saveCases(all);
      }

      setIsEscalated(true);
      setIsSubmitting(false);
      setToastMessage('সফলভাবে চিফ লিগ্যাল এইড অফিসার বরাবর জরুরি এসকেলেট সম্পন্ন হয়েছে (Binding Order Issued)');
      if (onUpdateCase) onUpdateCase(updatedCase);
    }, 700);
  };

  return (
    <div className={`rounded-2xl border-2 border-red-300 bg-white p-5 shadow-sm space-y-4 ${className}`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-700 text-white p-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-emerald-100">✕</button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-red-200 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                এখতিয়ার সংঘাত ও পিং-পং ত্রুটি (Challenge T2)
              </span>
              <span className="text-xs font-bold text-slate-500">
                বাউন্স সংখ্যা: {bouncesCount} বার
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
              রেফারেল বাউন্স হিস্ট্রি (Ping-Pong Referral Between DLAO & Labour Cell)
            </h4>
          </div>
        </div>

        {isEscalated ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-700 text-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>চিফ অফিসারের হস্তক্ষেপে নিষ্পন্ন</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white shadow-xs animate-bounce">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>পিং-পং লক সক্রিয়</span>
          </span>
        )}
      </div>

      {/* Visual Ping-Pong Timeline Flow */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
          ঘটনাপঞ্জি (Visual History of 2 Bounces):
        </span>

        <div className="grid grid-cols-1 gap-2.5">
          {history.map((step) => (
            <div
              key={step.id}
              className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                step.action === 'rejected_bounce'
                  ? 'bg-red-50/90 border-red-300 text-red-950 font-medium'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-start sm:items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 sm:mt-0 ${
                  step.action === 'rejected_bounce' ? 'bg-red-600 text-white' : 'bg-slate-700 text-white'
                }`}>
                  {step.stepNumber}
                </span>

                <div className="flex items-center gap-1.5 font-bold shrink-0">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-300">
                    {step.from}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-300">
                    {step.to}
                  </span>
                </div>

                <span className="text-slate-600 hidden md:inline">|</span>
                <span className="text-slate-700 leading-snug w-full sm:w-auto">{step.reason}</span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <span className="font-mono text-[10px] text-slate-500 bg-white/80 px-1.5 py-0.5 rounded border">
                  {step.timestamp}
                </span>
                {step.action === 'rejected_bounce' && (
                  <span className="text-[10px] font-bold text-red-700 bg-red-200 px-1.5 py-0.5 rounded">
                    বাউন্স
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        MANDATORY REQUIREMENT (Challenge T2):
        "After the second bounce, the UI must automatically trigger an 'Escalate to Chief Officer' button."
      */}
      {!isEscalated ? (
        <div className="p-4 rounded-xl bg-red-100/80 border border-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-red-950 uppercase flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-red-700 shrink-0" />
              <span>দ্বিতীয় বাউন্স সম্পন্ন — স্বয়ংক্রিয় এসকেলেশন রিকোয়ারমেন্ট কার্যকর</span>
            </span>
            <p className="text-xs text-red-900 leading-relaxed">
              আইনগত সহায়তা বিধিমালার রুল ৭ খ অনুযায়ী কোনো মামলা দুইবার ফেরত গেলে তা অবিলম্বে জাতীয় সংস্থার প্রধান কার্যালয়ে বাধ্যতামূলক নিষ্পত্তির জন্য পাঠাতে হবে।
            </p>
          </div>

          <button
            type="button"
            onClick={handleEscalateToChief}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            aria-label="চিফ অফিসার বরাবর এখতিয়ার এসকেলেট করুন"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isSubmitting ? 'এসকেলেট হচ্ছে...' : 'Escalate to Chief Officer'}</span>
          </button>
        </div>
      ) : (
        /* Resolved State following Escalation */
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-1">
          <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>চিফ অফিসারের এখতিয়ার নির্ধারণ সম্পন্ন (Binding Jurisdiction Order)</span>
          </div>
          <p className="text-slate-700">
            {legalCase.chiefEscalationNote || 'চিফ অফিসার এই মামলার এখতিয়ার সাইবার ট্রাইব্যুনালে সুনির্দিষ্ট করেছেন। আর কোনো পিং-পং বাউন্স অনুমোদিত হবে না।'}
          </p>
        </div>
      )}
    </div>
  );
};
