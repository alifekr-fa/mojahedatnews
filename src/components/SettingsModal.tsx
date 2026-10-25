import React from 'react';
import { ReadingPreferences } from '../types';
import { HardDrive, Trash2, DownloadCloud, RefreshCw, Palette } from 'lucide-react';

interface SettingsModalProps {
  readingPrefs: ReadingPreferences;
  onUpdateReadingPrefs: (prefs: Partial<ReadingPreferences>) => void;
  totalStorageKb: number;
  offlineCount: number;
  onSaveAllOffline: () => void;
  onClearOfflineCache: () => void;
  onSyncLiveData: () => void;
  isSyncing: boolean;
  lastSyncTime: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  readingPrefs,
  onUpdateReadingPrefs,
  totalStorageKb = 0,
  offlineCount = 0,
  onSaveAllOffline,
  onClearOfflineCache,
  onSyncLiveData,
  isSyncing,
}) => {
  const kb = totalStorageKb || 0;
  const count = offlineCount || 0;

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200 px-1 font-sans">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-extrabold mb-4 text-[#012d1d] dark:text-emerald-400 flex items-center gap-2">
          <Palette className="w-4 h-4" /> تنظیمات نمایش و مطالعه
        </h3>
        
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">تم مطالعه:</span>
            <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
              <button
                onClick={() => onUpdateReadingPrefs({ theme: 'light' })}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${readingPrefs.theme === 'light' ? 'bg-white text-black shadow-sm font-bold' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >روز</button>
              <button
                onClick={() => onUpdateReadingPrefs({ theme: 'sepia' })}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${readingPrefs.theme === 'sepia' ? 'bg-[#f4e5c3] text-[#7d562d] shadow-sm font-bold' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >کاغذی</button>
              <button
                onClick={() => onUpdateReadingPrefs({ theme: 'dark' })}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${readingPrefs.theme === 'dark' ? 'bg-gray-700 text-white shadow-sm font-bold' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >شب</button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-700/50">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">اندازه قلم مطالب:</span>
            <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
              {(['small', 'medium', 'large', 'xlarge'] as const).map((sz, i) => (
                <button
                  key={sz}
                  onClick={() => onUpdateReadingPrefs({ fontSize: sz })}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${readingPrefs.fontSize === sz ? 'bg-[#012d1d] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                >
                  {['۱', '۲', '۳', '۴'][i]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-extrabold mb-4 text-[#012d1d] dark:text-emerald-400 flex items-center gap-2">
          <HardDrive className="w-4 h-4" /> مدیریت حافظه و به‌روزرسانی
        </h3>
        
        <div className="flex justify-between items-center bg-gray-50 dark:bg-black/20 p-3.5 rounded-xl mb-4">
          <div className="flex gap-2 text-xs items-center text-gray-700 dark:text-gray-300">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>فضای مصرفی: {(kb / 1024).toFixed(1)} مگابایت</span>
          </div>
          <span className="text-[11px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold">
            {count} مطلب ذخیره شده
          </span>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onSaveAllOffline}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-3.5 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
          >
            <DownloadCloud className="w-4 h-4" /> دانلود همه مطالب برای مطالعه آفلاین
          </button>

          <button
            onClick={onClearOfflineCache}
            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> پاکسازی حافظه کش آفلاین
          </button>

          <button
            onClick={onSyncLiveData}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 bg-[#012d1d] text-white p-3.5 rounded-xl text-xs font-bold mt-2 hover:opacity-95 transition-opacity shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'در حال دریافت...' : 'دریافت جدیدترین اخبار از سرور'}
          </button>
        </div>
      </div>
    </div>
  );
};
