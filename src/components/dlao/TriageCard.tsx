import React from 'react';
import { LegalCase } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
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
  const { language } = useLanguage();

  // Helper to extract pure Bengali or pure English from mixed "English (Bangla)" strings
  const cleanSummary = (text: string) => {
    if (text.includes('(')) {
      if (language === 'bn') {
        const bnMatch = text.match(/\(([^)]+)\)/);
        return bnMatch ? bnMatch[1].trim() : text;
      } else {
        return text.split('(')[0].trim();
      }
    }
    return text;
  };

  // Helper for pure channel labels
  const getChannelLabel = () => {
    switch (legalCase.channel) {
      case 'udc':
        return language === 'bn' ? 'ইউডিসি ইনটেক' : 'UDC Center';
      case 'hotline':
        return language === 'bn' ? 'হটলাইন ১৬৪৩০' : 'Hotline 16430';
      case 'web':
        return language === 'bn' ? 'অনলাইন পোর্টাল' : 'Web Portal';
      case 'court_cell':
        return language === 'bn' ? 'কোর্ট সেল' : 'Court Cell';
      case 'police_referral':
        return language === 'bn' ? 'থানা রেফারেল' : 'Police Referral';
      default:
        return language === 'bn' ? 'লিগ্যাল এইড অফিস' : 'Legal Aid Office';
    }
  };

  // Helper for clean time ago without mixed parentheses
  const getTimeAgo = () => {
    const raw = legalCase.timeAgo.replace(/\s*\([^)]*\)/g, '').trim();
    if (language === 'bn') return raw;
    if (raw.includes('ঘণ্টা')) return '2 hours ago';
    if (raw.includes('মিনিট')) return '30 mins ago';
    if (raw.includes('দিন')) return '14 days ago';
    if (raw.includes('মাস')) return '1 month ago';
    if (raw.includes('এইমাত্র')) return 'Just now';
    return raw;
  };

  // Point 1: Visual Priority Badge - Softer rounded pills
  const renderPriorityBadge = () => {
    switch (legalCase.priority) {
      case 'urgent':
        return (
          <div
            className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold"
            aria-label={language === 'bn' ? 'অগ্রাধিকার: অতি জরুরি' : 'Priority: Urgent'}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
            <span>{language === 'bn' ? 'জরুরি' : 'Urgent'}</span>
          </div>
        );
      case 'medium':
        return (
          <div
            className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold"
            aria-label={language === 'bn' ? 'অগ্রাধিকার: মাঝারি' : 'Priority: Medium'}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            <span>{language === 'bn' ? 'মাঝারি' : 'Medium'}</span>
          </div>
        );
      case 'routine':
      default:
        return (
          <div
            className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold"
            aria-label={language === 'bn' ? 'অগ্রাধিকার: সাধারণ' : 'Priority: Routine'}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
            <span>{language === 'bn' ? 'সাধারণ' : 'Routine'}</span>
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

  // Point 5: Verification Status Badge - Soft pills without mixed brackets
  const renderVerificationBadge = () => {
    const isSubjectVerified = legalCase.provenance.subjectVerification === 'verified';

    if (legalCase.provenance.isProxy) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
          title={language === 'bn' ? 'প্রতিনিধি বায়োমেট্রিক সিম ভেরিফাইড' : 'Proxy SIM / Biometric Verified'}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>{language === 'bn' ? 'প্রক্সি যাচাইকৃত' : 'Proxy Verified'}</span>
        </span>
      );
    }

    if (isSubjectVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>{language === 'bn' ? 'এনআইডি যাচাইকৃত' : 'NID Verified'}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
        <HelpCircle className="w-3 h-3 text-slate-400" />
        <span>{language === 'bn' ? 'অযাচাইকৃত' : 'Unverified'}</span>
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
      aria-label={`${language === 'bn' ? 'মামলা বিস্তারিত দেখুন' : 'View case details'}: ${legalCase.provenance.subjectName}, ${language === 'bn' ? 'অগ্রাধিকার' : 'Priority'}: ${legalCase.priority}`}
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
              <span>{language === 'bn' ? 'মেয়াদোত্তীর্ণ' : 'Overdue'}</span>
            </span>
          )}

          {/* Child in Danger Pill */}
          {legalCase.hasChildInDanger && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
              <Baby className="w-3 h-3 text-purple-600" />
              <span>{language === 'bn' ? 'শিশু ঝুঁকিতে' : 'Child at Risk'}</span>
            </span>
          )}

          {/* Sensitive Pill */}
          {legalCase.isSensitive && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
              <span>{language === 'bn' ? 'সংবেদনশীল কেস' : 'Sensitive Case'}</span>
            </span>
          )}

          {/* Ping-Pong Bounce Pill */}
          {legalCase.pingPongBouncesCount && legalCase.pingPongBouncesCount >= 2 && (
            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
              <span>{language === 'bn' ? 'এখতিয়ার সংঘাত' : 'Referral Conflict'}</span>
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
                {cleanSummary(legalCase.aiSummary)}
              </p>
              {legalCase.aiSuggestedAction && (
                <p className="text-xs text-emerald-700/90 font-medium mt-1.5 truncate">
                  💡 {language === 'bn' ? 'প্রস্তাবিত পদক্ষেপ:' : 'Suggested Action:'} {legalCase.aiSuggestedAction}
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
            <span>{getChannelLabel()}</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{getTimeAgo()}</span>
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
