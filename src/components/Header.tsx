import React from 'react';
import { Search, RefreshCw, Smartphone, Monitor, Wifi } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  isFramed: boolean;
  onToggleFrame: () => void;
  onSyncLiveData: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, isFramed, onToggleFrame, onSyncLiveData, isSyncing }) => {
  return (
    <header className="bg-[#012d1d] text-white px-3 py-3 shadow-md flex items-center justify-between font-sans w-full z-50 relative shrink-0">
      <div className="flex items-center gap-1.5">
        <button 
          onClick={onToggleFrame} 
          className="w-8 h-8 hidden sm:flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white" 
          title="تغییر نما"
        >
          {isFramed ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        </button>
        <button 
          onClick={onOpenSearch} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white" 
          title="جستجو"
        >
          <Search className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-emerald-100 border border-white/5">
          <span className="text-[10px] font-bold">آنلاین</span>
          <Wifi className="w-3.5 h-3.5" />
        </div>

        <button 
          onClick={onSyncLiveData} 
          disabled={isSyncing} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white" 
          title="به‌روزرسانی اخبار"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex items-center gap-2.5 text-right">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] bg-[#d97736] text-white px-1.5 py-0.5 rounded font-bold leading-none shadow-sm">همراه</span>
            <h1 className="text-sm font-black tracking-wide text-white">مجاهدت</h1>
          </div>
          <span className="text-[10px] text-emerald-100/70 block" dir="ltr">mojahedat.com</span>
        </div>
        
        <a 
          href="https://mojahedat.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-10 px-1 bg-white rounded-xl flex items-center justify-center shadow-inner overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          title="ورود به سایت اصلی"
        >
          <img 
            src="/logo.svg" 
            alt="مجاهدت" 
            className="w-full h-full object-contain" 
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} 
          />
        </a>
      </div>
    </header>
  );
};
