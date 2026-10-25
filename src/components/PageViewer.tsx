import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PageViewerProps {
  pageId: number;
  onBack: () => void;
}

export const PageViewer: React.FC<PageViewerProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col font-sans">
      <div className="p-3 bg-[#012d1d] text-white flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/20"><ArrowRight className="w-5 h-5" /></button>
        <span className="text-xs font-bold">بازگشت</span>
      </div>
    </div>
  );
};
