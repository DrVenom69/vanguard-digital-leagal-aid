import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          className="flex items-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-95"
          aria-label="ইনস্টল করুন - আইন সহায়তা অ্যাপ"
        >
          <Download className="w-3.5 h-3.5" />
          <span>অ্যাপ ইনস্টল</span>
        </button>
      )}

      {isIOS && (
        <>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            aria-label="iOS ডিভাইসে ইনস্টল নির্দেশিকা"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>আইফোন ইনস্টল</span>
          </button>

          {showIOSGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-base font-bold text-slate-900">
                    iPhone / iPad এ অ্যাপ যুক্ত করুন
                  </h3>
                  <button
                    onClick={() => setShowIOSGuide(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                    aria-label="বন্ধ করুন"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 mt-0.5">১</span>
                    <span>সফারি ব্রাউজারের নিচে <Share2 className="w-4 h-4 inline mx-1 text-blue-600" /> <strong>Share</strong> বাটনে চাপুন।</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 mt-0.5">২</span>
                    <span>মেনু নিচে স্ক্রোল করে <PlusSquare className="w-4 h-4 inline mx-1 text-slate-700" /> <strong>Add to Home Screen</strong> চাপুন।</span>
                  </p>
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border">
                    💡 অফলাইনেও ইউনিয়ন ডিজিটাল সেন্টারের মতো নির্বিঘ্নে ব্যবহারের সুবিধা পাবেন।
                  </p>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition"
                >
                  ঠিক আছে, বুঝেছি
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
