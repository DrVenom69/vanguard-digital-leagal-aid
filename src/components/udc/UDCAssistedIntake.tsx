import React, { useState } from 'react';
import { TrafficLightSyncIndicator } from '../common/TrafficLightSyncIndicator';
import { 
  addToOfflineQueue, 
  getOfflineQueue, 
  saveCases, 
  getStoredCases, 
  syncOfflineQueueToMain 
} from '../../utils/storage';
import { LegalCase, PriorityLevel, Language } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Smartphone, 
  Mic, 
  MicOff, 
  Users, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  RefreshCw, 
  ShieldAlert, 
  Volume2, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  FileText, 
  Baby, 
  CheckSquare, 
  Layers
} from 'lucide-react';

interface UDCAssistedIntakeProps {
  isOnline: boolean;
  simulatedOffline: boolean;
  onToggleSimulatedNetwork: (offline: boolean) => void;
  onNavigateToDashboard?: () => void;
  language?: Language;
}

export const UDCAssistedIntake: React.FC<UDCAssistedIntakeProps> = ({
  isOnline,
  simulatedOffline,
  onToggleSimulatedNetwork,
  onNavigateToDashboard,
  language: propLanguage,
}) => {
  const { language: ctxLanguage } = useLanguage();
  const language = propLanguage || ctxLanguage;

  // Form State
  const [isProxy, setIsProxy] = useState<boolean>(true);
  const [callerName, setCallerName] = useState<string>('মোছাঃ সালমা খাতুন');
  const [callerPhone, setCallerPhone] = useState<string>('০১৭২৮-৯৪০৫১২');
  const [callerRelation, setCallerRelation] = useState<string>('ইউপি সদস্যা (মহিলা মেম্বার)');
  const [callerNid, setCallerNid] = useState<string>('19842615480000452');

  const [subjectName, setSubjectName] = useState<string>('মোছাঃ মরিয়ম বেগম');
  const [subjectAge, setSubjectAge] = useState<string>('২৭');
  const [subjectAddress, setSubjectAddress] = useState<string>('গ্রাম: বানিয়াচং, হবিগঞ্জ');
  const [category, setCategory] = useState<string>('পারিবারিক সহিংসতা ও যৌতুক');
  const [priority, setPriority] = useState<PriorityLevel>('urgent');
  const [hasChildInDanger, setHasChildInDanger] = useState<boolean>(true);
  const [safetyRisk, setSafetyRisk] = useState<boolean>(true);
  const [policeStation, setPoliceStation] = useState<string>('বানিয়াচং থানা');
  const [district, setDistrict] = useState<string>('হবিগঞ্জ');
  const [incidentDescription, setIncidentDescription] = useState<string>(
    'ভুক্তভোগীকে স্বামী ও শ্বশুরবাড়ির লোকজন টানা দুদিন যাবত মারধর করছে। সাথে ৩ বছরের সন্তান আছে। চিকিৎসার সুযোগ দেওয়া হচ্ছে না। ইউডিসি উদ্যোক্তার কাছে কান্নাকাটি করে নিরাপত্তা ও আইনি সহায়তা চেয়েছেন।'
  );
  const [desiredRelief, setDesiredRelief] = useState<string>(
    'অবিলম্বে আইনি নিরাপত্তা, সন্তানসহ আশ্রয় এবং সরকারি খরচে বিজ্ঞ প্যানেল আইনজীবী নিয়োগ।'
  );

  // Audio Voice Recording Simulation for illiterate citizens
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioRecorded, setAudioRecorded] = useState<boolean>(true);
  const [recordedDuration, setRecordedDuration] = useState<string>('০১:১৫');

  // Submission feedback
  const [saveToast, setSaveToast] = useState<{ message: string; isOffline: boolean } | null>(null);

  // Auto-fill preset for quick demonstration
  const handleAutoFill = (type: 'violence' | 'land' | 'maintenance') => {
    if (type === 'violence') {
      setIsProxy(true);
      setCallerName(language === 'bn' ? 'রোকসানা আক্তার' : 'Roksana Akhter');
      setCallerPhone('০১৮১৯-৩৩৪২৫১');
      setCallerRelation(language === 'bn' ? 'প্রতিবেশী ও স্থানীয় সাহায্যকারী' : 'Neighbor & Local Helper');
      setSubjectName(language === 'bn' ? 'ফরিদা পারভীন' : 'Farida Parveen');
      setSubjectAge('২২');
      setSubjectAddress(language === 'bn' ? 'গ্রাম: চর কলমি, তজুমদ্দিন, ভোলা' : 'Char Kolmi, Tazumuddin, Bhola');
      setCategory('পারিবারিক সহিংসতা ও যৌতুক');
      setPriority('urgent');
      setHasChildInDanger(true);
      setSafetyRisk(true);
      setPoliceStation(language === 'bn' ? 'তজুমদ্দিন থানা' : 'Tazumuddin PS');
      setDistrict(language === 'bn' ? 'ভোলা' : 'Bhola');
      setIncidentDescription(
        language === 'bn'
          ? 'যৌতুকের জন্য ভুক্তভোগীকে ধারালো অস্ত্র দিয়ে জখম করা হয়েছে। স্থানীয় হাসপাতালে প্রাথমিক চিকিৎসা দেওয়া হয়েছে। বর্তমানে প্রতিবেশীর আশ্রয়ে আছেন। অপরাধী পক্ষ হুমকি দিচ্ছে।'
          : 'Victim was injured with sharp weapons over dowry demands. First aid received at local hospital. Currently taking refuge with a neighbor. Perpetrators are threatening.'
      );
      setDesiredRelief(
        language === 'bn'
          ? 'নিরাপত্তা বিধান, ভিকটিম সাপোর্ট সেন্টারে প্রেরণ ও ফৌজদারি মামলা পরিচালনায় আইনি সহায়তা।'
          : 'Security protection, victim support shelter, and government legal aid for criminal prosecution.'
      );
    } else if (type === 'land') {
      setIsProxy(false);
      setCallerName(language === 'bn' ? 'মোঃ আব্দুর রহিম' : 'Md. Abdur Rahim');
      setCallerPhone('০১৭৩১-৮৯৪০১২');
      setCallerRelation(language === 'bn' ? 'ভুক্তভোগী নিজে' : 'Victim Self');
      setSubjectName(language === 'bn' ? 'মোঃ আব্দুর রহিম' : 'Md. Abdur Rahim');
      setSubjectAge('৬৫');
      setSubjectAddress(language === 'bn' ? 'গ্রাম: শিবপুর, ভৈরব, কিশোরগঞ্জ' : 'Shivpur, Bhairab, Kishoreganj');
      setCategory('জমি জবরদখল ও এতিমের সম্পত্তি বেদখল');
      setPriority('medium');
      setHasChildInDanger(false);
      setSafetyRisk(false);
      setPoliceStation(language === 'bn' ? 'ভৈরব থানা' : 'Bhairab PS');
      setDistrict(language === 'bn' ? 'কিশোরগঞ্জ' : 'Kishoreganj');
      setIncidentDescription(
        language === 'bn'
          ? 'পৈতৃক ভিটার ২০ শতাংশ জমি স্থানীয় প্রভাবশালী পক্ষ জাল কাগজ তৈরি করে জবরদখল করেছে। বৃদ্ধ বয়সে আদালতে বারবার গিয়ে খরচ বহন করার সামর্থ্য নেই।'
          : 'Local influential group forged deeds to usurp 20 decimals of ancestral homestead land. In old age, cannot afford repeated court travel and expenses.'
      );
      setDesiredRelief(
        language === 'bn'
          ? 'ডিএলএও কার্যালয় হতে এডিআর (বিকল্প বিরোধ নিষ্পত্তি) তলব ও দেওয়ানি সহায়তা।'
          : 'Call for ADR mediation from DLAO office and civil case assistance.'
      );
    } else {
      setIsProxy(true);
      setCallerName(language === 'bn' ? 'মোছাঃ খাদিজা বেগম' : 'Mst. Khadija Begum');
      setCallerPhone('০১৬১১-৯৮৭৬৫৪');
      setCallerRelation(language === 'bn' ? 'মা' : 'Mother');
      setSubjectName(language === 'bn' ? 'আফসানা আক্তার' : 'Afsana Akhter');
      setSubjectAge('১৯');
      setSubjectAddress(language === 'bn' ? 'কালীগঞ্জ, ঝিনাইদহ' : 'Kaliganj, Jhenaidah');
      setCategory('দেনমোহর ও সন্তানের ভরণপোষণ');
      setPriority('routine');
      setHasChildInDanger(false);
      setSafetyRisk(false);
      setPoliceStation(language === 'bn' ? 'কালীগঞ্জ থানা' : 'Kaliganj PS');
      setDistrict(language === 'bn' ? 'ঝিনাইদহ' : 'Jhenaidah');
      setIncidentDescription(
        language === 'bn'
          ? 'স্বামী গত এক বছর ধরে কোনো খরচ দিচ্ছেন না। তালাকের মৌখিক হুমকি দিয়ে দ্বিতীয় বিবাহ করেছেন। কোনো দেনমোহর পরিশোধ করেননি।'
          : 'Husband has not provided living costs for a year. Married second wife with verbal divorce threats. Has not paid dower.'
      );
      setDesiredRelief(
        language === 'bn'
          ? 'পারিবারিক আদালতে দেনমোহর ও খোরপোশ মোকদ্দমার জন্য সরকারি লিগ্যাল এইড।'
          : 'Government legal aid for dower and maintenance suit in family court.'
      );
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trackingNumber = `DLA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase: LegalCase = {
      id: `case-${Date.now()}`,
      trackingNumber,
      createdAt: new Date().toISOString(),
      timeAgo: isOnline 
        ? (language === 'bn' ? 'এইমাত্র' : 'Just now')
        : (language === 'bn' ? 'ডিভাইসে অপেক্ষমাণ' : 'Pending on device'),
      priority,
      category,
      aiSummary: generateAISummary(category, hasChildInDanger, priority, incidentDescription),
      aiConfidenceScore: 95,
      aiSuggestedAction: priority === 'urgent'
        ? (language === 'bn' ? 'জরুরি পুলিশ প্রোটেকশন ও বিজ্ঞ ডিএলএও কর্মকর্তার তাৎক্ষণিক তলব' : 'Immediate police protection and urgent DLAO intervention')
        : (language === 'bn' ? 'এডিআর বৈঠক বা প্যানেল আইনজীবী মনোনয়ন' : 'ADR mediation or panel lawyer nomination'),
      channel: 'udc',
      channelLabel: language === 'bn' ? 'ইউনিয়ন ডিজিটাল সেন্টার' : 'Union Digital Center (UDC)',
      status: 'new',
      isOverdue: false,
      provenance: {
        callerName: callerName.trim() || (language === 'bn' ? 'অজ্ঞাত সাহায্যকারী' : 'Anonymous Helper'),
        callerPhone: callerPhone.trim() || '০১৭০০-০০০০০০',
        callerNid: callerNid.trim() || '19902615480000000',
        callerVerification: 'verified',
        callerRelation: isProxy ? callerRelation : (language === 'bn' ? 'ভুক্তভোগী নিজে' : 'Victim Self'),
        subjectName: subjectName.trim() || (language === 'bn' ? 'অজ্ঞাত ভুক্তভোগী' : 'Anonymous Subject'),
        subjectAge: subjectAge ? parseInt(subjectAge) : 25,
        subjectGender: 'নারী',
        subjectVerification: isProxy ? 'unconfirmed' : 'verified',
        subjectAddress: subjectAddress.trim() || (language === 'bn' ? 'ইউনিয়ন ডিজিটাল সেন্টার এলাকা' : 'UDC Jurisdiction Area'),
        isProxy,
        proxyConsentObtained: true,
        safetyAlert: safetyRisk 
          ? (language === 'bn' 
              ? 'ভুক্তভোগীর জীবন ও নিরাপত্তার চরম ঝুঁকি রয়েছে। সরাসরি প্রকাশ্যে যোগাযোগ নিষিদ্ধ।' 
              : 'Severe safety risk to victim. Direct public contact is prohibited.')
          : undefined,
      },
      incidentDescription,
      desiredRelief,
      hasChildInDanger,
      policeStation,
      district,
      upazila: district ? `${district} সদর` : (language === 'bn' ? 'উপজেলা পরিষদ' : 'Upazila Parishad'),
      unionParishad: language === 'bn' ? 'ইউনিয়ন ডিজিটাল সেন্টার অধিক্ষেত্র' : 'Union Digital Center Jurisdiction',
      audioDuration: audioRecorded ? recordedDuration : undefined,
      audioTranscript: audioRecorded ? incidentDescription.slice(0, 80) + '...' : undefined,
      evidenceFiles: [
        { name: 'UDC_Application_Intake.pdf', type: 'application/pdf', size: '240 KB' },
        { name: 'Applicant_Biometric_Log.dat', type: 'application/octet-stream', size: '48 KB' }
      ]
    };

    if (!isOnline) {
      // OFFLINE STATE: Save to mock localStorage queue
      addToOfflineQueue(newCase);
      setSaveToast({
        message: language === 'bn'
          ? `আবেদনটি ইন্টারনেট ছাড়াই আপনার ডিভাইসে নিরাপদে সংরক্ষিত হয়েছে! (ট্র্যাকিং: ${trackingNumber})`
          : `Application saved safely on your device without internet! (Tracking: ${trackingNumber})`,
        isOffline: true,
      });
    } else {
      // ONLINE STATE: Save directly to main cases
      const existing = getStoredCases();
      saveCases([newCase, ...existing]);
      setSaveToast({
        message: language === 'bn'
          ? `আবেদনটি কেন্দ্রীয় ডিএলএও ড্যাশবোর্ডে সফলভাবে প্রেরিত হয়েছে! (ট্র্যাকিং: ${trackingNumber})`
          : `Application successfully submitted to central DLAO dashboard! (Tracking: ${trackingNumber})`,
        isOffline: false,
      });
    }

    setTimeout(() => {
      setSaveToast(null);
    }, 4500);
  };

  const generateAISummary = (
    cat: string,
    child: boolean,
    prio: PriorityLevel,
    desc: string
  ) => {
    if (prio === 'urgent' && child) {
      return language === 'bn'
        ? 'শারীরিক নির্যাতন চলমান ও কোলে শিশু বিপন্ন'
        : 'Ongoing violence + Child at risk';
    }
    if (prio === 'urgent') {
      return language === 'bn'
        ? 'চরম শারীরিক ঝুঁকি ও তাৎক্ষণিক উদ্ধার প্রয়োজন'
        : 'Critical threat + Physical danger';
    }
    if (cat.includes('জমি') || cat.includes('Land')) {
      return language === 'bn'
        ? 'বসতভিটা বেদখল ও দেওয়ানি প্রতিকার প্রার্থনা'
        : 'Land encroachment + Marginalized family';
    }
    return language === 'bn'
      ? `${cat} (আইনি সহায়তা প্রার্থনা)`
      : `${cat} (Legal counsel requested)`;
  };

  const offlineQueue = getOfflineQueue();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Traffic Light Sync Indicator */}
      <section aria-label={language === 'bn' ? 'নেটওয়ার্ক সিঙ্ক ট্রাফিক লাইট স্ট্যাটাস' : 'Network sync traffic light status'}>
        <TrafficLightSyncIndicator
          isOnline={isOnline}
          showQueueDetails={true}
        />
      </section>

      {/* Hero Banner: UDC Assisted Intake Orientation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {language === 'bn' ? 'ইউডিসি সহকারী ইনটেক ফর্ম' : 'UDC Assisted Intake Form'}
              </h2>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                {language === 'bn' ? 'অফলাইন-ফার্স্ট' : 'Offline-First'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {language === 'bn'
                ? 'নিরক্ষর বা প্রান্তিক জনগোষ্ঠীর পক্ষে ডিজিটাল সেন্টারের উদ্যোক্তা কর্তৃক সহজে অভিযোগ লিপিবদ্ধকরণ।'
                : 'Assisted complaint intake by Union Digital Center entrepreneurs for citizens.'}
            </p>
          </div>
        </div>

        {/* Demo Fast Preset Switcher & Network Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 px-1.5">
              {language === 'bn' ? 'নমুনা পূরণ:' : 'Demo Fill:'}
            </span>
            <button
              type="button"
              onClick={() => handleAutoFill('violence')}
              className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-700 font-bold text-xs rounded-lg shadow-2xs border border-slate-200 transition active:scale-95 cursor-pointer"
              title={language === 'bn' ? 'জরুরি পারিবারিক সহিংসতা ডেমো' : 'Urgent domestic violence demo'}
            >
              {language === 'bn' ? 'সহিংসতা' : 'Violence'}
            </button>
            <button
              type="button"
              onClick={() => handleAutoFill('land')}
              className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-amber-800 font-bold text-xs rounded-lg shadow-2xs border border-slate-200 transition active:scale-95 cursor-pointer"
              title={language === 'bn' ? 'জমিজমা বিরোধ ডেমো' : 'Land dispute demo'}
            >
              {language === 'bn' ? 'জমিজমা' : 'Land'}
            </button>
            <button
              type="button"
              onClick={() => handleAutoFill('maintenance')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-800 font-bold text-xs rounded-lg shadow-2xs border border-slate-200 transition active:scale-95 cursor-pointer"
              title={language === 'bn' ? 'ভরণপোষণ দাবি ডেমো' : 'Maintenance claim demo'}
            >
              {language === 'bn' ? 'খোরপোশ' : 'Maintenance'}
            </button>
          </div>

          {/* Quick toggle offline for demonstration */}
          <button
            type="button"
            onClick={() => onToggleSimulatedNetwork(!simulatedOffline)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer ${
              !isOnline
                ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse'
                : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
            }`}
          >
            {!isOnline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>
              {!isOnline 
                ? (language === 'bn' ? 'অফলাইন মোড' : 'Offline Mode') 
                : (language === 'bn' ? 'অনলাইন মোড' : 'Online Mode')}
            </span>
          </button>
        </div>
      </div>

      {/* Save Toast notification */}
      {saveToast && (
        <div
          role="status"
          className={`p-4 rounded-xl shadow-lg border flex items-center justify-between gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
            saveToast.isOffline
              ? 'bg-amber-100 border-amber-300 text-amber-950'
              : 'bg-emerald-600 border-emerald-700 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {saveToast.isOffline ? (
              <Save className="w-5 h-5 text-amber-800 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />
            )}
            <span>{saveToast.message}</span>
          </div>
          {onNavigateToDashboard && (
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="text-xs bg-black/10 hover:bg-black/20 px-3 py-1 rounded-lg shrink-0 underline cursor-pointer"
            >
              {language === 'bn' ? 'ড্যাশবোর্ডে দেখুন' : 'View Dashboard'}
            </button>
          )}
        </div>
      )}

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Voice Recording Simulation (Crucial for Illiterate Users) */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950">
                  {language === 'bn' ? 'ভয়েস জবানবন্দি গ্রহণ' : 'Voice Statement Recording'}
                </h3>
                <p className="text-xs text-blue-700">
                  {language === 'bn'
                    ? 'কথা রেকর্ড করলে এআই স্বয়ংক্রিয়ভাবে টেক্সট ও সারাংশ প্রস্তুত করবে।'
                    : 'Recording audio enables AI transcription and automated summary.'}
                </p>
              </div>
            </div>
            {audioRecorded && (
              <span className="text-xs font-mono font-bold bg-white text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
                {recordedDuration} {language === 'bn' ? 'রেকর্ডকৃত' : 'Recorded'}
              </span>
            )}
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setIsRecording(!isRecording);
                  if (!isRecording) {
                    setAudioRecorded(true);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : audioRecorded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label={isRecording ? (language === 'bn' ? 'রেকর্ডিং বন্ধ করুন' : 'Stop recording') : (language === 'bn' ? 'রেকর্ডিং শুরু করুন' : 'Start recording')}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>{language === 'bn' ? 'রেকর্ডিং চলছে (থামান)' : 'Recording... (Stop)'}</span>
                  </>
                ) : audioRecorded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ভয়েস রেকর্ড সম্পন্ন (আবার করুন)' : 'Recording Complete (Redo)'}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>{language === 'bn' ? 'রেকর্ড শুরু করুন' : 'Start Recording'}</span>
                  </>
                )}
              </button>

              <span className="text-xs text-slate-500 font-medium">
                {isRecording 
                  ? (language === 'bn' ? 'উদ্যোক্তার মাইকে কথা শুনছে...' : 'Listening via microphone...') 
                  : (language === 'bn' ? 'মাইক্রোফোন প্রস্তুত' : 'Microphone Ready')}
              </span>
            </div>

            {/* Simulated Live Audio Waveform */}
            <div className="flex items-center gap-1 h-7 w-full sm:w-48 justify-end">
              {[30, 50, 80, 40, 90, 60, 30, 70, 85, 40, 60, 95, 40, 70].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${isRecording ? (h + (i % 3) * 15) % 100 : 25}%` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Provenance Separation (Caller vs Subject) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-extrabold text-slate-900">
                {language === 'bn' ? 'প্রোভেন্যান্স যাচাইকরণ' : 'Provenance Verification'}
              </h3>
            </div>
            
            {/* Proxy Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIsProxy(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  !isProxy ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {language === 'bn' ? 'ভুক্তভোগী নিজে' : 'Victim Directly'}
              </button>
              <button
                type="button"
                onClick={() => setIsProxy(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isProxy ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                {language === 'bn' ? 'প্রতিনিধি / প্রক্সি' : 'Proxy / Representative'}
              </button>
            </div>
          </div>

          {/* Caller Details Section */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                {language === 'bn'
                  ? '১. যিনি কথা বলছেন (রিপোর্টার) — বায়োমেট্রিক ও সিম যাচাইকৃত'
                  : '1. Caller / Reporter — Biometric & SIM Verified'}
              </span>
              <span className="text-[11px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded shadow-2xs">
                {language === 'bn' ? 'যাচাইকৃত' : 'Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'কথা বলিয়ে ব্যক্তির নাম:' : 'Caller Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder={language === 'bn' ? 'যেমন: মোছাঃ সালমা খাতুন' : 'e.g. Salma Khatun'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর (সিম যাচাইকৃত):' : 'Mobile Number (SIM Verified):'}
                </label>
                <input
                  type="tel"
                  required
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder="০১৭**-******"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ভুক্তভোগীর সাথে সম্পর্ক:' : 'Relationship to Subject:'}
                </label>
                <input
                  type="text"
                  value={callerRelation}
                  onChange={(e) => setCallerRelation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder={language === 'bn' ? 'যেমন: ইউপি মেম্বার / প্রতিবেশী / অভিভাবক' : 'e.g. UP Member / Neighbor / Guardian'}
                />
              </div>
            </div>
          </div>

          {/* Subject Details Section */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                {language === 'bn' ? '২. যার বিষয়ে অভিযোগ (ভুক্তভোগী)' : '2. Subject / Victim Details'}
              </span>
              <span className="text-[11px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow-2xs">
                {isProxy 
                  ? (language === 'bn' ? 'অনিশ্চিত' : 'Unconfirmed') 
                  : (language === 'bn' ? 'যাচাইকৃত' : 'Verified')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ভুক্তভোগীর পুরো নাম:' : 'Victim Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder={language === 'bn' ? 'যেমন: মোছাঃ মরিয়ম বেগম' : 'e.g. Morium Begum'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'আনুমানিক বয়স:' : 'Approximate Age:'}
                </label>
                <input
                  type="number"
                  value={subjectAge}
                  onChange={(e) => setSubjectAge(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder="২৭"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'গ্রাম ও ঠিকানা:' : 'Village & Address:'}
                </label>
                <input
                  type="text"
                  required
                  value={subjectAddress}
                  onChange={(e) => setSubjectAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder={language === 'bn' ? 'গ্রাম, ওয়ার্ড, ইউনিয়ন...' : 'Village, Ward, Union...'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Case Nature, Urgency & Safety Alert */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <span>{language === 'bn' ? 'মামলার ধরন ও জরুরি মূল্যায়ন' : 'Case Category & Urgency Triage'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'মামলা / সমস্যার ধরন:' : 'Case / Dispute Type:'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
              >
                <option value="পারিবারিক সহিংসতা ও যৌতুক">
                  {language === 'bn' ? 'পারিবারিক সহিংসতা ও শারীরিক নির্যাতন' : 'Domestic Violence & Abuse'}
                </option>
                <option value="বাল্যবিয়ে প্রতিরোধ ও জোরপূর্বক আটক">
                  {language === 'bn' ? 'বাল্যবিয়ে প্রতিরোধ ও জোরপূর্বক আটক' : 'Child Marriage Prevention & Detention'}
                </option>
                <option value="জমি জবরদখল ও এতিমের সম্পত্তি বেদখল">
                  {language === 'bn' ? 'জমি জবরদখল ও এতিমের সম্পত্তি বেদখল' : 'Land Encroachment & Property Grabbing'}
                </option>
                <option value="দেনমোহর ও সন্তানের ভরণপোষণ">
                  {language === 'bn' ? 'দেনমোহর ও সন্তানের ভরণপোষণ দাবি' : 'Dower & Child Maintenance'}
                </option>
                <option value="প্রবাসী শ্রমিকের ক্ষতিপূরণ ও প্রতারণা">
                  {language === 'bn' ? 'প্রবাসী শ্রমিকের ক্ষতিপূরণ ও মজুরি' : 'Migrant Worker Compensation & Wages'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'প্রাথমিক অগ্রাধিকার মাত্রা:' : 'Initial Priority Level:'}
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('urgent')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                    priority === 'urgent'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-red-50'
                  }`}
                >
                  <span>▲ {language === 'bn' ? 'জরুরি' : 'Urgent'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                    priority === 'medium'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <span>● {language === 'bn' ? 'মাঝারি' : 'Medium'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('routine')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                    priority === 'routine'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  <span>{language === 'bn' ? 'সাধারণ' : 'Routine'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Child Danger and Safety Alert checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-purple-200 bg-purple-50/50 cursor-pointer hover:bg-purple-50 transition">
              <input
                type="checkbox"
                checked={hasChildInDanger}
                onChange={(e) => setHasChildInDanger(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs font-bold text-purple-950 flex items-center gap-1">
                <Baby className="w-4 h-4 text-purple-700" />
                {language === 'bn' ? 'কোলে বা সাথে শিশু বিপন্ন অবস্থায় রয়েছে' : 'Child accompanying or in danger'}
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-red-200 bg-red-50/50 cursor-pointer hover:bg-red-50 transition">
              <input
                type="checkbox"
                checked={safetyRisk}
                onChange={(e) => setSafetyRisk(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-red-950 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                {language === 'bn' ? 'ভুক্তভোগীর চরম নিরাপত্তা ঝুঁকি' : 'Critical Safety Risk (Confidentiality vital)'}
              </span>
            </label>
          </div>

          {/* Incident Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'ঘটনার সংক্ষিপ্ত বিবরণ:' : 'Incident Description / Summary:'}
            </label>
            <textarea
              rows={3}
              required
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-600 leading-relaxed"
              placeholder={language === 'bn' ? 'ভুক্তভোগীর অভিযোগের বিবরণ লিখুন...' : 'Write incident details...'}
            />
          </div>

          {/* Desired Relief */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'প্রত্যাশিত আইনগত প্রতিকার:' : 'Desired Legal Relief:'}
            </label>
            <input
              type="text"
              required
              value={desiredRelief}
              onChange={(e) => setDesiredRelief(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-600"
              placeholder={language === 'bn' ? 'যেমন: সরকারি আইনজীবী নিয়োগ / মধ্যস্থতা / পুলিশ নিরাপত্তা' : 'e.g. Panel lawyer / Mediation / Police protection'}
            />
          </div>
        </div>

        {/* Submit Bar with Large Touch Target */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${!isOnline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {!isOnline
                  ? (language === 'bn' ? 'অফলাইন মোড সক্রিয় — ডিভাইসে নিরাপদ রাখা হবে' : 'Offline Mode Active — Saved safely on device')
                  : (language === 'bn' ? 'অনলাইন সংযুক্ত — কেন্দ্রীয় ডাটাবেজে সরাসরি সিঙ্ক হবে' : 'Online Connected — Syncs to central database')}
              </div>
              <div className="text-xs text-slate-400">
                {!isOnline
                  ? (language === 'bn' ? 'নেটওয়ার্ক আসার পর "সিঙ্ক করুন" বাটনে চাপলে অটোমেটিক কেন্দ্রীয় ড্যাশবোর্ডে যাবে।' : 'Click "Sync" when connected to push queued cases to dashboard.')
                  : (language === 'bn' ? 'আবেদনকারীকে তাৎক্ষণিক ট্র্যাকিং নম্বর সহ এসএমএস পাঠানো হবে।' : 'Instant SMS with tracking number will be sent to the applicant.')}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[50px] px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>
              {!isOnline 
                ? (language === 'bn' ? 'ডিভাইসে নিরাপদ সংরক্ষণ' : 'Save on Device') 
                : (language === 'bn' ? 'আবেদন দাখিল করুন' : 'Submit Application')}
            </span>
          </button>
        </div>
      </form>

      {/* Queued Offline Cases List Display if any */}
      {offlineQueue.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl border border-amber-300 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-extrabold text-amber-950">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>
                {language === 'bn' 
                  ? `লোকাল ডিভাইসে সংরক্ষিত অপেক্ষমাণ আবেদন (${offlineQueue.length}টি)`
                  : `Locally Queued Applications (${offlineQueue.length})`}
              </span>
            </div>
            <span className="text-xs text-amber-800 font-semibold">
              {language === 'bn' ? 'ডিভাইসে অক্ষত' : 'Safe on Device'}
            </span>
          </div>

          <div className="space-y-2">
            {offlineQueue.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{item.provenance.subjectName}</span>
                  <span className="text-slate-500 ml-2">({item.category})</span>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    {language === 'bn' ? 'ট্র্যাকিং' : 'Tracking'}: {item.trackingNumber} · {language === 'bn' ? 'কথা বলেছেন' : 'Caller'}: {item.provenance.callerName}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300 shrink-0">
                  {language === 'bn' ? 'অপেক্ষমাণ' : 'Pending Sync'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
