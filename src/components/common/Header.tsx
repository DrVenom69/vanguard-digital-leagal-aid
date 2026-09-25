import React, { useState } from 'react';
import { UserRole } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Scale, 
  Building2, 
  Smartphone, 
  UserCheck, 
  Briefcase,
  Wifi, 
  WifiOff, 
  PhoneCall,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  Layers,
  X
} from 'lucide-react';
import { resetDemoData } from '../../utils/storage';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isOnline: boolean;
  simulatedOffline: boolean;
  onToggleSimulatedNetwork: (offline: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isOnline,
  simulatedOffline,
  onToggleSimulatedNetwork,
}) => {
  const [showRoleDrawer, setShowRoleDrawer] = useState(false);

  const rolesConfig: {
    role: UserRole;
    num: string;
    title: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      role: 'dlao',
      num: '১',
      title: 'DLAO Admin (ট্রায়াজ)',
      subtitle: 'আইনগত সহায়তা আবেদন ব্যাকলগ ও ঝুঁকি মূল্যায়ন',
      icon: Building2,
      accentColor: 'text-emerald-400',
    },
    {
      role: 'udc',
      num: '২',
      title: 'UDC উদ্যোক্তা (ইনটেক)',
      subtitle: 'অফলাইন-ফার্স্ট সহকারী অভিযোগ এন্ট্রি ও ভয়েস রেকর্ড',
      icon: Smartphone,
      accentColor: 'text-blue-400',
    },
    {
      role: 'citizen',
      num: '৩',
      title: 'নাগরিক / প্রতিনিধি',
      subtitle: 'মালেকের সহজ অডিও ভিউ ও আবেদন ট্র্যাকিং',
      icon: UserCheck,
      accentColor: 'text-purple-400',
    },
    {
      role: 'mediator',
      num: '৪',
      title: 'মধ্যস্থতাকারী (ADR)',
      subtitle: 'এআই সমঝোতা খসড়া ও দ্বি-পক্ষীয় ই-স্বাক্ষর',
      icon: Scale,
      accentColor: 'text-teal-400',
    },
    {
      role: 'lawyer',
      num: '৫',
      title: 'প্যানেল আইনজীবী (B5)',
      subtitle: 'মামলা অগ্রগতি ও শুনানির তারিখ আপডেট পোর্টাল',
      icon: Briefcase,
      accentColor: 'text-amber-400',
    },
  ];

  const currentRoleInfo = rolesConfig.find((r) => r.role === currentRole) || rolesConfig[0];
  const CurrentIcon = currentRoleInfo.icon;

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        {/* Top micro-bar: Government info & Hotline */}
        <div className="bg-emerald-950 border-b border-emerald-900/60 px-3 sm:px-4 py-1 text-xs text-emerald-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-600 border border-emerald-400 shrink-0" />
              <span className="font-semibold text-white tracking-wide truncate text-[11px] sm:text-xs">
                গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
              </span>
              <span className="text-emerald-400 hidden sm:inline">|</span>
              <span className="hidden md:inline truncate text-[11px] sm:text-xs text-emerald-300">
                জাতীয় আইনগত সহায়তা প্রদান সংস্থা (NLASO)
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:16430"
                className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 sm:px-2.5 py-0.5 rounded-full font-bold text-[11px] sm:text-xs shadow-xs transition active:scale-95"
                aria-label="টোল ফ্রি জাতীয় লিগ্যাল এইড হটলাইন ১৬৪৩০"
              >
                <PhoneCall className="w-3 h-3" />
                <span>১৬৪৩০</span>
                <span className="text-[9px] bg-red-800/90 px-1 rounded uppercase hidden xs:inline">টোল-ফ্রি</span>
              </a>

              <button
                onClick={() => {
                  if (confirm('ডেমো ডেটা প্রাথমিক অবস্থায় রিসেট করতে চান?')) {
                    resetDemoData();
                    window.location.reload();
                  }
                }}
                className="text-slate-400 hover:text-white p-1 text-[11px] flex items-center gap-1 transition"
                title="রিসেট ডেমো ডেটা"
                aria-label="ডেমো তথ্য পুনরায় সেট করুন"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden lg:inline">রিসেট</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main navigation & role switcher */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo & System Brand */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 border border-emerald-500/40 flex items-center justify-center shadow-md shrink-0">
                <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-100" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-sans truncate">
                    ডিজিটাল লিগ্যাল এইড
                  </h1>
                  <span className="hidden xs:inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded">
                    PWA
                  </span>
                </div>
                {/* Mobile Active Role Quick Trigger */}
                <button
                  type="button"
                  onClick={() => setShowRoleDrawer(true)}
                  className="lg:hidden flex items-center gap-1 text-[11px] text-emerald-300 font-bold hover:text-white transition group"
                  aria-label="ভূমিকা পরিবর্তন করুন"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                  <span className="truncate">{currentRoleInfo.title}</span>
                  <ChevronDown className="w-3 h-3 text-emerald-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
                </button>
                <p className="hidden lg:block text-xs text-slate-400">
                  অফলাইন-ফার্স্ট ট্রায়াজ ও প্রক্সি প্রোভেন্যান্স সিস্টেম
                </p>
              </div>
            </div>

            {/* Mobile Actions: Network Toggle + Install Button */}
            <div className="lg:hidden flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onToggleSimulatedNetwork(!simulatedOffline)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition active:scale-95 ${
                  isOnline
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-600 text-amber-300 animate-pulse'
                }`}
                aria-label={isOnline ? 'সিমুলেটেড অফলাইন করুন' : 'অনলাইন করুন'}
                title={isOnline ? 'ইন্টারনেট অনলাইন (ট্যাপ করে অফলাইন টেস্ট করুন)' : 'অফলাইন মোড সক্রিয় (ট্যাপ করে অনলাইন করুন)'}
              >
                {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
              </button>

              <PWAInstallButton />
            </div>

            {/* Desktop Role-Based Views Switcher */}
            <div className="hidden lg:flex items-center gap-3">
              <div
                className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 flex items-center shadow-inner"
                role="tablist"
                aria-label="ব্যবহারকারীর ভূমিকা নির্বাচন"
              >
                {rolesConfig.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRole === item.role;
                  return (
                    <button
                      key={item.role}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onRoleChange(item.role)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap min-h-[38px] ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop Quick Network Simulation & Install Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSimulatedNetwork(!simulatedOffline)}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition active:scale-95 ${
                    isOnline
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-emerald-400'
                      : 'bg-amber-950/80 hover:bg-amber-900/80 border-amber-600 text-amber-300 ring-1 ring-amber-500'
                  }`}
                  title="হ্যাকথন পিচ সিমুলেশন: ইন্টারনেট অন/অফ পরীক্ষা করুন"
                  aria-label={isOnline ? 'নেটওয়ার্ক অফলাইন সিমুলেট করুন' : 'নেটওয়ার্ক অনলাইন ফিরিয়ে আনুন'}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-emerald-400" />
                      <span>অনলাইন</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>অফলাইন</span>
                    </>
                  )}
                </button>
                <PWAInstallButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Role Switcher Bottom Sheet / Modal */}
      {showRoleDrawer && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="ভূমিকা নির্বাচন ড্রয়ার"
        >
          {/* Backdrop click to dismiss */}
          <div className="flex-1" onClick={() => setShowRoleDrawer(false)} />

          <div
            className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 max-h-[85vh] overflow-y-auto"
            style={{
              paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1.5rem)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">
                  ব্যবহারকারীর ভূমিকা নির্বাচন করুন
                </h3>
              </div>
              <button
                onClick={() => setShowRoleDrawer(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
                aria-label="ড্রয়ার বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {rolesConfig.map((item) => {
                const Icon = item.icon;
                const isSelected = currentRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      onRoleChange(item.role);
                      setShowRoleDrawer(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3.5 transition active:scale-98 ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-400 text-white shadow-md'
                        : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-white">
                          {item.title}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                            সক্রিয়
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center text-xs text-slate-500">
              💡 আপনি নিচের নেভিগেশন বার থেকেও যেকোনো সময় ভূমিকা পরিবর্তন করতে পারেন।
            </div>
          </div>
        </div>
      )}
    </>
  );
};

