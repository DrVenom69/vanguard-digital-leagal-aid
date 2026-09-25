import React from 'react';
import { ProvenanceDetails } from '../../types';
import { 
  PhoneCall, 
  UserCheck2, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  Lock, 
  FileCheck2,
  Users
} from 'lucide-react';

interface ProvenanceHeaderProps {
  provenance: ProvenanceDetails;
  trackingNumber?: string;
  className?: string;
}

export const ProvenanceHeader: React.FC<ProvenanceHeaderProps> = ({
  provenance,
  trackingNumber,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden ${className}`}
      aria-label="আবেদনকারী ও ভুক্তভোগীর তথ্যের পৃথকীকরণ (Provenance Header)"
    >
      {/* Title bar: Legal disclaimer on proxy protection */}
      <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Users className="w-4 h-4 text-emerald-700" />
          <span className="font-bold">প্রক্সি প্রোভেন্যান্স যাচাই (Provenance Master Component)</span>
        </div>
        {trackingNumber && (
          <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border">
            {trackingNumber}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3.5">
        {/* ROW 1: যিনি কথা বলছেন (Caller/Reporter) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 gap-2">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-emerald-800">
                যিনি কথা বলছেন (Caller / Reporter):
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{provenance.callerName}</span>
                <span className="text-xs text-slate-500 font-normal">
                  ({provenance.callerRelation || 'প্রতিনিধি'})
                </span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                <span>মোবাইল: {provenance.callerPhone}</span>
                {provenance.callerNid && (
                  <span className="font-mono text-[11px] text-slate-500">
                    · এনআইডি: {provenance.callerNid.slice(0, 6)}***{provenance.callerNid.slice(-4)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Solid Green Verified Badge */}
          <div className="sm:self-center shrink-0">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold tracking-wide shadow-xs"
              role="status"
              aria-label="সিম ও বায়োমেট্রিক দ্বারা যাচাইকৃত"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>যাচাইকৃত (Verified)</span>
            </span>
          </div>
        </div>

        {/* ROW 2: যার বিষয়ে অভিযোগ (Subject / Victim) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 gap-2">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-amber-900">
                যার বিষয়ে অভিযোগ (Subject / Victim in Need):
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{provenance.subjectName}</span>
                {provenance.subjectAge && (
                  <span className="text-xs text-slate-600 font-normal">
                    · বয়স: {provenance.subjectAge} বছর ({provenance.subjectGender || 'ভুক্তভোগী'})
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                <span>ঠিকানা: {provenance.subjectAddress}</span>
              </div>
            </div>
          </div>

          {/* Amber Unconfirmed Badge */}
          <div className="sm:self-center shrink-0">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold tracking-wide shadow-xs"
              role="status"
              aria-label="ভুক্তভোগীর পরিচয় এখনো সরাসরি অপ্রমাণিত"
            >
              <HelpCircle className="w-4 h-4" />
              <span>অনিশ্চিত (Unconfirmed)</span>
            </span>
          </div>
        </div>

        {/* Safety Alert Warning if present */}
        {provenance.safetyAlert && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs leading-relaxed">
            <Lock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-900">নিরাপত্তা ও গোপনীয়তা প্রোটোকল: </span>
              {provenance.safetyAlert}
            </div>
          </div>
        )}

        {/* Proxy Consent & Protection Note */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
          <span className="flex items-center gap-1 text-slate-600">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            লিগ্যাল এইড অ্যাক্ট ২০০০ ধারা ১১ অনুযায়ী প্রক্সি প্রতিনিধি আবেদন অনুমোদিত
          </span>
          <span className="font-medium text-slate-500">
            {provenance.proxyConsentObtained ? '✓ মৌখিক/লিখিত সম্মতি লিপিবদ্ধ' : '⚠️ দ্রুত ভেরিফিকেশন তলব'}
          </span>
        </div>
      </div>
    </div>
  );
};
