import React from 'react';
import { Home, List, DownloadCloud, Settings, Link2 } from 'lucide-react';

export type TabType = 'home' | 'feed' | 'offline' | 'links' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  offlineCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, offlineCount }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121815] border-t border-gray-100 dark:border-white/5 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] font-sans">
      <div className="flex items-center justify-around p-2 max-w-md mx-auto">
        <button
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center gap-1 p-2 min-w-[50px] transition-colors ${activeTab === 'home' ? 'text-[#012d1d] dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Home className={`w-6 h-6 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[10px]">خانه</span>
        </button>

        <button
          onClick={() => onChangeTab('feed')}
          className={`flex flex-col items-center gap-1 p-2 min-w-[50px] transition-colors ${activeTab === 'feed' ? 'text-[#012d1d] dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <List className={`w-6 h-6 transition-transform ${activeTab === 'feed' ? 'scale-110' : ''}`} />
          <span className="text-[10px]">مطالب</span>
        </button>

        <button
          onClick={() => onChangeTab('links')}
          className={`flex flex-col items-center gap-1 p-2 min-w-[50px] transition-colors ${activeTab === 'links' ? 'text-[#012d1d] dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Link2 className={`w-6 h-6 transition-transform ${activeTab === 'links' ? 'scale-110' : ''}`} />
          <span className="text-[10px]">لینک‌ها</span>
        </button>

        <button
          onClick={() => onChangeTab('offline')}
          className={`flex flex-col items-center gap-1 p-2 min-w-[50px] transition-colors relative ${activeTab === 'offline' ? 'text-[#012d1d] dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <div className="relative">
            <DownloadCloud className={`w-6 h-6 transition-transform ${activeTab === 'offline' ? 'scale-110' : ''}`} />
            {offlineCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#121815]">
                {offlineCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">ذخیره‌ها</span>
        </button>

        <button
          onClick={() => onChangeTab('settings')}
          className={`flex flex-col items-center gap-1 p-2 min-w-[50px] transition-colors ${activeTab === 'settings' ? 'text-[#012d1d] dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Settings className={`w-6 h-6 transition-transform ${activeTab === 'settings' ? 'scale-110' : ''}`} />
          <span className="text-[10px]">تنظیمات</span>
        </button>
      </div>
    </div>
  );
};
