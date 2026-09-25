import React from 'react';
import { LegalCase } from '../../types';
import { 
  AlertTriangle, 
  Clock, 
  Smartphone, 
  PhoneCall, 
  Globe, 
  Scale, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  User,
  Baby
} from 'lucide-react';

interface TriageCardProps {
  legalCase: LegalCase;
  onSelect: (legalCase: LegalCase) => void;
}

export const TriageCard: React.FC<TriageCardProps> = ({ legalCase, onSelect }) => {
  // Point 1: Visual Priority Badge
  const renderPriorityBadge = () => {
    switch (legalCase.priority) {
      case 'urgent':
        return (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs tracking-wider shadow-xs animate-pulse"
            aria-label="অগ্রাধিকার: অতি জরুরি"
          >
            {/* Red Triangle */}
            <span className="text-white text-sm leading-none font-black">▲</span>
            <span>জরুরি (URGENT)</span>
          </div>
        );
      case 'medium':
        return (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs tracking-wider shadow-xs"
            aria-label="অগ্রাধিকার: মাঝারি"
          >
            {/* Yellow Circle */}
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 inline-block" />
            <span>মাঝারি (MEDIUM)</span>
          </div>
        );
      case 'routine':
      default:
        return (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs tracking-wider shadow-xs"
            aria-label="অগ্রাধিকার: সাধারণ"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" />
            <span>সাধারণ (ROUTINE)</span>
          </div>
        );
    }
  };

  // Point 4: Channel Icon
  const renderChannelIcon = () => {
    switch (legalCase.channel) {
      case 'udc':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-700" />;
      case 'hotline':
        return <PhoneCall className="w-3.5 h-3.5 text-red-600" />;
      case 'web':
        return <Globe className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Scale className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  // Point 5: Verification Status Badge
  const renderVerificationBadge = () => {
    const isCallerVerified = legalCase.provenance.callerVerification === 'verified';
    const isSubjectVerified = legalCase.provenance.subjectVerification === 'verified';

    if (legalCase.provenance.isProxy) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100/90 text-emerald-900 border border-emerald-300"
          title="প্রতিনিধি বায়োমেট্রিক/সিম ভেরিফাইড কিন্তু ভুক্তভোগী তদন্তাধীন"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-700" />
          <span>প্রক্সি ভেরিফাইড (Proxy SIM/NID)</span>
        </span>
      );
    }

    if (isSubjectVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100/90 text-emerald-900 border border-emerald-300">
          <ShieldCheck className="w-3 h-3 text-emerald-700" />
          <span>সরাসরি NID যাচাইকৃত</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
        <HelpCircle className="w-3 h-3 text-amber-700" />
        <span>অযাচাইকৃত (Unverified)</span>
      </span>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(legalCase)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(legalCase);
        }
      }}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 cursor-pointer shadow-xs hover:shadow-md hover:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
        legalCase.priority === 'urgent'
          ? 'border-red-200 bg-linear-to-r from-red-50/20 via-white to-white'
          : 'border-slate-200'
      }`}
      aria-label={`মামলা বিস্তারিত দেখুন: ${legalCase.provenance.subjectName}, অগ্রাধিকার: ${legalCase.priority}`}
    >
      {/* Top row: Priority Badge + Tracking & Overdue indicator + Verification */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {/* 1. Priority Badge */}
          {renderPriorityBadge()}

          {legalCase.isOverdue && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-800 font-bold text-xs border border-red-300 animate-pulse">
              <Clock className="w-3 h-3 text-red-700" />
              <span>মেয়াদোত্তীর্ণ (Overdue)</span>
            </span>
          )}

          {legalCase.hasChildInDanger && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-xs font-semibold">
              <Baby className="w-3 h-3 text-purple-700" />
              <span>শিশু ঝুঁকিতে</span>
            </span>
          )}

          {legalCase.isSensitive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-200 text-purple-950 text-xs font-bold border border-purple-400">
              <span>সংবেদনশীল (Role B6)</span>
            </span>
          )}

          {legalCase.pingPongBouncesCount && legalCase.pingPongBouncesCount >= 2 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-900 text-xs font-bold border border-red-300 animate-pulse">
              <span>পিং-পং বাউন্স (T2)</span>
            </span>
          )}
        </div>

        {/* 5. Verification status badge */}
        <div className="flex items-center gap-2">
          {renderVerificationBadge()}
          <span className="text-xs font-mono font-bold text-slate-500 hidden md:inline">
            {legalCase.trackingNumber}
          </span>
        </div>
      </div>

      {/* Middle row: Subject Name + AI Summary */}
      <div className="pt-3 pb-2">
        {/* 2. Subject's Name (bold typography) */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <User className="w-3 h-3 text-slate-400" />
              <span>ভুক্তভোগী / আবেদনকারীর নাম:</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
              {legalCase.provenance.subjectName}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {legalCase.category}
            </span>
          </div>
        </div>

        {/* 3. One-line AI generated summary */}
        <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:border-emerald-200 group-hover:bg-emerald-50/40 transition-colors">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                {legalCase.aiSummary}
              </p>
              {legalCase.aiSuggestedAction && (
                <p className="text-[11px] text-emerald-800 font-medium mt-0.5 truncate">
                  💡 প্রস্তাবিত পদক্ষেপ: {legalCase.aiSuggestedAction}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: 4. Intake channel icon and time elapsed + Slide out CTA */}
      <div className="pt-3 mt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            {renderChannelIcon()}
            <span>{legalCase.channelLabel}</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{legalCase.timeAgo}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
          <span>বিস্তারিত ডসিয়ার</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
