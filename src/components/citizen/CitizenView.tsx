import React, { useState } from 'react';
import { getStoredCases } from '../../utils/storage';
import { LegalCase } from '../../types';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Scale, 
  ShieldCheck, 
  PhoneCall, 
  User, 
  HelpCircle, 
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  HeartHandshake,
  Calendar,
  Volume2,
  VolumeX,
  Building2,
  Gavel,
  ThumbsUp,
  UserCheck
} from 'lucide-react';

export const CitizenView: React.FC = () => {
  // Mode switcher: Default to Malek's Simplified View (Challenge A5) as required by prompt
  const [viewMode, setViewMode] = useState<'malek' | 'standard'>('malek');

  // Search state for standard view
  const [trackingInput, setTrackingInput] = useState('DLA-2026-0701');
  const [searchedCase, setSearchedCase] = useState<LegalCase | null>(() => {
    const all = getStoredCases();
    return all.find((c) => c.trackingNumber === 'DLA-2026-0701') || all[0] || null;
  });
  const [notFound, setNotFound] = useState(false);

  // Audio voice simulation state for Malek (low literacy)
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Find Malek's specific case
  const allCases = getStoredCases();
  const malekCase = allCases.find((c) => c.id === 'case-malek' || c.trackingNumber === 'DLA-2026-0701') || {
    id: 'case-malek',
    trackingNumber: 'DLA-2026-0701',
    createdAt: new Date().toISOString(),
    timeAgo: '১৪ দিন আগে',
    priority: 'medium' as const,
    category: 'পৈতৃক ভিটা সুরক্ষা ও বেদখল প্রতিরোধ',
    aiSummary: 'Elderly Farmer Land Dispute',
    channel: 'udc' as const,
    channelLabel: 'UDC',
    status: 'lawyer_assigned' as const,
    assignedLawyer: 'অ্যাডভোকেট সুরাইয়া পারভীন (Advocate Suraiya Parveen)',
    assignedLawyerPhone: '০১৭১২-৩৪৫৬৭৮',
    nextHearingDate: '১২ অক্টোবর ২০২৬ (বুধবার সকাল ১০:৩০)',
    hearingCourtName: 'যুগ্ম জেলা জজ ১ম আদালত, ঢাকা',
    hearingStage: 'সাক্ষ্যগ্রহণ ও জবানবন্দি গ্রহণ পর্ব',
    provenance: {
      callerName: 'মোঃ আব্দুল মালেক (Malek)',
      callerPhone: '০১৭৩১-৫৫৪০১২',
      callerVerification: 'verified' as const,
      callerRelation: 'ভুক্তভোগী নিজে',
      subjectName: 'মোঃ আব্দুল মালেক (Malek)',
      subjectAge: 64,
      subjectAddress: 'গ্রাম: চর মিরপুর, কেরানীগঞ্জ, ঢাকা',
      subjectVerification: 'verified' as const,
      isProxy: false,
      proxyConsentObtained: true
    },
    incidentDescription: 'কৃষক আব্দুল মালেক নিরক্ষর। স্থানীয় প্রভাবশালীরা তার বসতভিটা দখলের চেষ্টা করছে।',
    desiredRelief: 'চিরস্থায়ী নিষেধাজ্ঞা।',
    hasChildInDanger: false,
    policeStation: 'কেরানীগঞ্জ থানা',
    district: 'ঢাকা',
    upazila: 'কেরানীগঞ্জ'
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingInput.trim().toUpperCase();
    const all = getStoredCases();
    const found = all.find((c) => c.trackingNumber.toUpperCase() === query);
    if (found) {
      setSearchedCase(found);
      setNotFound(false);
    } else {
      setNotFound(true);
      setSearchedCase(null);
    }
  };

  const handleVoicePlay = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const textToSpeak = `আসসালামু আলাইকুম মালেক সাহেব। আপনার মামলার পরবর্তী শুনানির তারিখ ১২ অক্টোবর ২০২৬, বুধবার সকাল ১০টা ৩০ মিনিট। আপনার জন্য সরকারিভাবে নিযুক্ত আইনজীবী হলেন অ্যাডভোকেট সুরাইয়া পারভীন। তার মোবাইল নম্বর ০১৭১২-৩৪৫৬৭৮। আপনার মামলার কাগজপত্র প্রস্তুত আছে।`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsSpeaking(false);
      }, 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner: Navigation between Malek View and Standard View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-700" />
          <span className="text-sm font-extrabold text-slate-900">
            নাগরিক ইন্টারফেস মোড:
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode('malek')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-black transition flex items-center justify-center gap-1.5 ${
              viewMode === 'malek'
                ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-500'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">মালেকের সহজ ভিউ (A5)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('standard')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              viewMode === 'standard'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="truncate">সাধারণ ট্র্যাকিং</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW FOR MALEK (CHALLENGE A5) - ULTRA SIMPLIFIED & LOW-TEXT    */}
      {/* ============================================================== */}
      {viewMode === 'malek' ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Malek Welcome Banner with Voice Readout */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
                    সহজ নাগরিক ড্যাশবোর্ড · স্ক্রিন রিডারহীন ব্যবহারবান্ধব
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  স্বাগতম, মোঃ আব্দুল মালেক
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100">
                  <span className="bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-600/60 font-mono font-bold">
                    আইডি: {malekCase.trackingNumber}
                  </span>
                  <span>·</span>
                  <span>বিষয়: {malekCase.category}</span>
                </div>
              </div>

              {/* Large Voice Readout Button for Low-Literacy Users */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleVoicePlay}
                  className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-xl transition active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'bg-white text-emerald-900 hover:bg-emerald-50'
                  }`}
                  aria-label="মামলার অবস্থা মুখে শুনে জানুন"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-6 h-6 text-slate-950" />
                      <span>শব্দ বন্ধ করুন</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-6 h-6 text-emerald-700 animate-bounce" />
                      <span>মুখে শুনুন (Voice Status)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* TWO MAIN LARGE-ICON BLOCKS AS SPECIFIED IN CHALLENGE A5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ================= CARD 1: NEXT HEARING DATE ================= */}
            <div className="rounded-3xl border-2 border-emerald-400 bg-white p-6 shadow-md hover:shadow-lg transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  পরবর্তী শুনানির তারিখ
                </span>
                <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  আদালতে হাজিরার দিন
                </span>
              </div>

              {/* Very Large Calendar Icon & Date Display */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-bold block">
                    Next Hearing Date:
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                    {malekCase.nextHearingDate || '১২ অক্টোবর ২০২৬'}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>বুধবার · সকাল ১০:৩০ মিনিট</span>
                  </div>
                </div>
              </div>

              {/* Court Location */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Gavel className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{malekCase.hearingCourtName}</span>
                </div>
                <p className="text-slate-500 text-xs pl-5.5">
                  বিচার ভবনের ৩য় তলা, জজ কোর্ট প্রাঙ্গণ, ঢাকা
                </p>
              </div>

              {/* Visual Countdown Badge */}
              <div className="bg-emerald-50 text-emerald-900 font-extrabold text-xs sm:text-sm p-3 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>শুনানির আর ১৬ দিন বাকি</span>
                </span>
                <span className="bg-emerald-700 text-white text-[11px] px-2.5 py-0.5 rounded-full">
                  সময়মতো পৌঁছান
                </span>
              </div>
            </div>

            {/* ================= CARD 2: ASSIGNED LAWYER ================= */}
            <div className="rounded-3xl border-2 border-teal-400 bg-white p-6 shadow-md hover:shadow-lg transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                  নিযুক্ত সরকারি আইনজীবী
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ১০০% বিনামূল্যে
                </span>
              </div>

              {/* Very Large Lawyer / Scale Icon & Lawyer Name */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Scale className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-bold block">
                    Assigned Lawyer:
                  </span>
                  <div className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
                    {malekCase.assignedLawyer}
                  </div>
                  <div className="text-xs text-teal-800 font-semibold">
                    জেলা লিগ্যাল এইড প্যানেল আইনজীবী নং-০৭
                  </div>
                </div>
              </div>

              {/* Phone Details & Large 1-Tap Dial Button */}
              <div className="bg-teal-50/80 p-3.5 rounded-2xl border border-teal-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-teal-900 font-bold">আইনজীবীর ফোন নম্বর:</span>
                  <div className="font-mono text-base font-black text-slate-900">
                    {malekCase.assignedLawyerPhone || '০১৭১২-৩৪৫৬৭৮'}
                  </div>
                </div>

                <a
                  href={`tel:${malekCase.assignedLawyerPhone || '01712345678'}`}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 shrink-0"
                  aria-label="আইনজীবীকে সরাসরি ফোন করুন"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>ফোন করুন</span>
                </a>
              </div>

              {/* Government Guarantee Note */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  আইনজীবীর সকল ফি সরকার বহন করেছে। কাউকে কোনো টাকা দেওয়া নিষেধ।
                </span>
              </div>
            </div>
          </div>

          {/* Large Visual Status Indicator for Illiterate Users */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-700" />
              <span>আপনার মামলার বর্তমান সার্বিক অবস্থা</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center font-black text-lg mb-2">
                  ✓
                </div>
                <div className="text-sm font-extrabold text-slate-900">আবেদন সফল</div>
                <div className="text-xs text-slate-500 mt-0.5">কাগজপত্র অনুমোদিত</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-600 text-white border border-emerald-700 shadow-md">
                <div className="w-10 h-10 rounded-full bg-white text-emerald-700 mx-auto flex items-center justify-center font-black text-lg mb-2">
                  ✓
                </div>
                <div className="text-sm font-extrabold text-white">উকিল নিযুক্ত (চলমান)</div>
                <div className="text-xs text-emerald-100 mt-0.5">মামলা প্রস্তুতি শেষ</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 mx-auto flex items-center justify-center font-black text-lg mb-2">
                  ৩
                </div>
                <div className="text-sm font-bold text-slate-700">আদালতে শুনানি</div>
                <div className="text-xs text-slate-400 mt-0.5">১২ অক্টোবর অনুষ্ঠিত হবে</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* STANDARD VIEW - TRACK BY ANY NUMBER & FULL CITIZEN RESOURCES   */
        /* ============================================================== */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Welcome banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Scale className="w-3.5 h-3.5" />
                  <span>আইনের আশ্রয় লাভের অধিকার সবার</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  বিনামূল্যে আইনি সহায়তা ও কেস ট্র্যাকিং
                </h2>
                <p className="text-sm text-emerald-100 max-w-lg leading-relaxed">
                  আপনার আবেদনের বর্তমান অগ্রগতি জানুন অথবা নিকটস্থ ইউনিয়ন ডিজিটাল সেন্টারে যোগাযোগ না করেই ট্র্যাকিং আইডি দিয়ে মামলার সর্বশেষ অবস্থা দেখুন।
                </p>
              </div>

              {/* Hotline 16430 */}
              <div className="bg-red-600/90 rounded-2xl p-4 text-center shrink-0 border border-red-400 shadow-lg">
                <div className="text-xs uppercase font-extrabold text-red-100 tracking-wider">
                  জাতীয় আইনগত সহায়তা হটলাইন
                </div>
                <a
                  href="tel:16430"
                  className="text-2xl sm:text-3xl font-black text-white block my-1 hover:underline tracking-widest font-mono"
                >
                  ১৬৪৩০
                </a>
                <div className="text-[11px] text-red-100 font-semibold bg-red-800/80 px-2 py-0.5 rounded-full inline-block">
                  টোল-ফ্রি · যে কোনো মোবাইল থেকে ফ্রি
                </div>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-700" />
              <span>আবেদনের সর্বশেষ অবস্থা অনুসন্ধান করুন (Search by Tracking ID)</span>
            </h3>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="ট্র্যাকিং আইডি দিন (যেমন: DLA-2026-0701)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  aria-label="আবেদনের ট্র্যাকিং আইডি ইনপুট"
                />
              </div>
              <button
                type="submit"
                className="min-h-[46px] px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>অবস্থা অনুসন্ধান</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
              <span>নমুনা নম্বর:</span>
              {['DLA-2026-0701 (মালেক)', 'DLA-2026-0814', 'DLA-2026-0792', 'DLA-2026-0831'].map((num) => {
                const cleanNum = num.split(' ')[0];
                return (
                  <button
                    key={cleanNum}
                    type="button"
                    onClick={() => {
                      setTrackingInput(cleanNum);
                      const all = getStoredCases();
                      const found = all.find((c) => c.trackingNumber === cleanNum);
                      if (found) setSearchedCase(found);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg font-mono font-semibold border border-slate-200 transition"
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Searched Case Details */}
          {searchedCase && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-5 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">আবেদন ট্র্যাকিং নম্বর:</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-800">
                    {searchedCase.trackingNumber}
                  </div>
                </div>

                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {searchedCase.status === 'lawyer_assigned'
                    ? 'আইনজীবী নিয়োগ সম্পন্ন'
                    : searchedCase.status === 'adr_scheduled'
                    ? 'এডিআর মধ্যস্থতা নির্ধারিত'
                    : 'প্রাথমিক ট্রায়াজ সমাপ্ত'}
                </span>
              </div>

              {/* Hearing Date and Assigned Lawyer Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>পরবর্তী শুনানির তারিখ (Next Hearing):</span>
                  </span>
                  <div className="text-base font-extrabold text-slate-900">
                    {searchedCase.nextHearingDate || 'এখনো তারিখ ধার্য হয়নি'}
                  </div>
                  <div className="text-xs text-slate-600">
                    আদালত: {searchedCase.hearingCourtName || searchedCase.policeStation}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1">
                  <span className="text-xs font-bold text-teal-950 uppercase flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-teal-700" />
                    <span>নিযুক্ত সরকারি আইনজীবী (Assigned Lawyer):</span>
                  </span>
                  <div className="text-base font-extrabold text-slate-900">
                    {searchedCase.assignedLawyer || 'আইনজীবী নিয়োগ প্রক্রিয়াধীন'}
                  </div>
                  <div className="text-xs text-slate-600">
                    ফোন: {searchedCase.assignedLawyerPhone || 'ডিএলএও হটলাইনে যোগাযোগ করুন'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {notFound && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-900 space-y-2">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
              <h4 className="font-bold text-base">আবেদন নম্বরটি খুঁজে পাওয়া যায়নি</h4>
              <p className="text-xs text-red-700">
                অনুগ্রহ করে ট্র্যাকিং আইডি পুনরায় পরীক্ষা করুন অথবা সরাসরি ১৬৪৩০ নম্বরে কল করে সাহায্য নিন।
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
