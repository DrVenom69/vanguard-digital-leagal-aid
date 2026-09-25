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
  // Point 1: Visual Priority Badge - Softer rounded pills
  const renderPriorityBadge = () => {
    switch (legalCase.priority) {
      case 'urgent':
        return (
          <div
            className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold"
            aria-label="অগ্রাধিকার: অতি জরুরি"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
            <span>জরুরি (URGENT)</span>
          </div>
        );
      case 'medium':
        return (
          <div
            className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold"
            aria-label="অগ্রাধিকার: মাঝারি"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            <span>মাঝারি (MEDIUM)</span>
          </div>
        );
      case 'routine':
      default:
        return (
          <div
            className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold"
            aria-label="অগ্রাধিকার: সাধারণ"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
            <span>সাধারণ (ROUTINE)</span>
          </div>
        );
    }
  };

  // Point 4: Channel Icon
  const renderChannelIcon = () => {
    switch (legalCase.channel) {
      case 'udc':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-600" />;
      case 'hotline':
        return <PhoneCall className="w-3.5 h-3.5 text-red-500" />;
      case 'web':
        return <Globe className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Scale className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  // Point 5: Verification Status Badge - Soft pills
  const renderVerificationBadge = () => {
    const isSubjectVerified = legalCase.provenance.subjectVerification === 'verified';

    if (legalCase.provenance.isProxy) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
          title="প্রতিনিধি বায়োমেট্রিক/সিম ভেরিফাইড কিন্তু ভুক্তভোগী তদন্তাধীন"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>প্রক্সি ভেরিফাইড</span>
        </span>
      );
    }

    if (isSubjectVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>NID যাচাইকৃত</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
        <HelpCircle className="w-3 h-3 text-slate-400" />
        <span>অযাচাইকৃত</span>
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
      className="group relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all border border-slate-100/50 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
      aria-label={`মামলা বিস্তারিত দেখুন: ${legalCase.provenance.subjectName}, অগ্রাধিকার: ${legalCase.priority}`}
    >
      {/* Top row: Status Badges (Pills) + Tracking Number in Top Right */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Priority Pill */}
          {renderPriorityBadge()}

          {/* Overdue Pill */}
          {legalCase.isOverdue && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>মেয়াদোত্তীর্ণ</span>
            </span>
          )}

          {/* Child in Danger Pill */}
          {legalCase.hasChildInDanger && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
              <Baby className="w-3 h-3 text-purple-600" />
              <span>শিশু ঝুঁকিতে</span>
            </span>
          )}

          {/* Sensitive Pill */}
          {legalCase.isSensitive && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
              <span>সংবেদনশীল (Role B6)</span>
            </span>
          )}

          {/* Ping-Pong Bounce Pill */}
          {legalCase.pingPongBouncesCount && legalCase.pingPongBouncesCount >= 2 && (
            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
              <span>পিং-পং বাউন্স (T2)</span>
            </span>
          )}
        </div>

        {/* Quiet, Faded Tracking Number in Top Right */}
        <span className="text-xs font-mono font-medium text-slate-400 shrink-0">
          {legalCase.trackingNumber}
        </span>
      </div>

      {/* Middle row: Subject Name + Category + AI Summary Box */}
      <div className="pt-4 pb-2">
        <div className="flex items-baseline justify-between gap-3">
          {/* Massive, Clean Subject Name */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
            {legalCase.provenance.subjectName}
          </h3>

          {/* Category Pill */}
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shrink-0">
            {legalCase.category}
          </span>
        </div>

        {/* Calm, Soft Borderless AI Summary Box */}
        <div className="bg-slate-50/80 rounded-2xl p-4 mt-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {legalCase.aiSummary}
              </p>
              {legalCase.aiSuggestedAction && (
                <p className="text-xs text-emerald-700/90 font-medium mt-1.5 truncate">
                  💡 প্রস্তাবিত পদক্ষেপ: {legalCase.aiSuggestedAction}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Channel, Time, Verification Pill & Calm Chevron */}
      <div className="pt-3 mt-1 flex items-center justify-between text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            {renderChannelIcon()}
            <span>{legalCase.channelLabel}</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{legalCase.timeAgo}</span>
          </div>
          <div className="hidden sm:inline-flex">
            {renderVerificationBadge()}
          </div>
        </div>

        {/* Context-obvious subtle navigation affordance without redundant text clutter */}
        <div className="flex items-center text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
