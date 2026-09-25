import React, { useEffect, useState } from 'react';
import { Cloud, Clock, CheckCircle2, RefreshCw, AlertCircle, HardDrive } from 'lucide-react';
import { getOfflineQueue, syncOfflineQueueToMain } from '../../utils/storage';

interface TrafficLightSyncIndicatorProps {
  isOnline: boolean;
  onSyncComplete?: (count: number) => void;
  className?: string;
  showQueueDetails?: boolean;
}

export const TrafficLightSyncIndicator: React.FC<TrafficLightSyncIndicatorProps> = ({
  isOnline,
  onSyncComplete,
  className = '',
  showQueueDetails = true,
}) => {
  const [queueCount, setQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  const updateQueueCount = () => {
    setQueueCount(getOfflineQueue().length);
  };

  useEffect(() => {
    updateQueueCount();
    window.addEventListener('legal_aid_queue_updated', updateQueueCount);
    window.addEventListener('legal_aid_cases_updated', updateQueueCount);
    return () => {
      window.removeEventListener('legal_aid_queue_updated', updateQueueCount);
      window.removeEventListener('legal_aid_cases_updated', updateQueueCount);
    };
  }, []);

  // When coming back online and there is a queue, or manually triggered
  const handleTriggerSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    try {
      const result = await syncOfflineQueueToMain(900);
      setIsSyncing(false);
      if (result.syncedCount > 0) {
        setShowSuccessBanner(true);
        if (onSyncComplete) onSyncComplete(result.syncedCount);
        // Green banner transitions after 3.5 seconds to static green checkmark
        setTimeout(() => {
          setShowSuccessBanner(false);
        }, 3500);
      }
    } catch (e) {
      console.error(e);
      setIsSyncing(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Success transition banner */}
      {showSuccessBanner && (
        <div
          role="status"
          aria-live="polite"
          className="transition-all duration-300 transform ease-out bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between animate-bounce"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />
            <span className="font-bold text-sm tracking-wide">সব পাঠানো হয়েছে ✅</span>
          </div>
          <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full font-medium">
            সার্ভারে সংরক্ষিত
          </span>
        </div>
      )}

      {/* Main Traffic Light Indicator Pill */}
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
          !isOnline
            ? 'bg-amber-50/90 border-amber-300 text-amber-900 shadow-sm'
            : isSyncing
            ? 'bg-blue-50/90 border-blue-300 text-blue-900 shadow-sm'
            : 'bg-emerald-50/90 border-emerald-300 text-emerald-900 shadow-sm'
        }`}
        aria-live="polite"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {!isOnline ? (
            /* STATE 1: OFFLINE - Amber pulsing cloud/clock icon with "ডিভাইসে নিরাপদ" */
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 border border-amber-300">
                <Cloud className="w-4 h-4 animate-pulse" />
                <Clock className="w-3 h-3 absolute -bottom-0.5 -right-0.5 text-amber-800 bg-white rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block" />
                  ডিভাইসে নিরাপদ
                </span>
                <span className="text-xs text-amber-700 font-medium">
                  {queueCount > 0 ? `${queueCount}টি আবেদন মেমোরিতে রক্ষিত (অফলাইন)` : 'ইন্টারনেট ছাড়াই সুরক্ষিত'}
                </span>
              </div>
            </div>
          ) : isSyncing ? (
            /* SYNCING STATE */
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-blue-900">কেন্দ্রীয় সিস্টেমে পাঠানো হচ্ছে...</span>
                <span className="text-xs text-blue-600">অনুগ্রহ করে অপেক্ষা করুন</span>
              </div>
            </div>
          ) : (
            /* STATE 2 (Static): Green Checkmark when synced */
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  অনলাইন সংযুক্ত
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  {queueCount === 0 ? 'সকল তথ্য রিয়েল-টাইমে আপডেট' : `${queueCount}টি সিঙ্কের জন্য প্রস্তুত`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Sync or Queue Count */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {queueCount > 0 && (
            <span
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${
                !isOnline
                  ? 'bg-amber-200/80 text-amber-900 border-amber-400'
                  : 'bg-emerald-200 text-emerald-900 border-emerald-400'
              }`}
            >
              <HardDrive className="w-3 h-3" />
              {queueCount} অপেক্ষমাণ
            </span>
          )}

          {isOnline && queueCount > 0 && (
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-1 active:scale-95"
              aria-label="অপেক্ষমাণ আবেদন কেন্দ্রীয় সার্ভারে সিঙ্ক করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              সিঙ্ক করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
