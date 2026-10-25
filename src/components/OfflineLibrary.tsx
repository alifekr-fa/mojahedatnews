import React, { useState } from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { DownloadCloud, Bookmark, Trash2 } from 'lucide-react';

interface OfflineLibraryProps {
  offlineArticles: Article[];
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  onToggleOffline: (article: Article) => void;
  onSaveAllOffline: () => void;
  onClearOfflineCache: () => void;
  totalStorageKb: number;
}

export const OfflineLibrary: React.FC<OfflineLibraryProps> = ({
  offlineArticles = [],
  bookmarkedArticles = [],
  onSelectArticle,
  onToggleBookmark,
  onToggleOffline,
  onSaveAllOffline,
  onClearOfflineCache,
  totalStorageKb = 0,
}) => {
  const [subTab, setSubTab] = useState<'offline' | 'bookmarks'>('offline');
  const kb = totalStorageKb || 0;

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200 font-sans">
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setSubTab('offline')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'offline'
              ? 'bg-white dark:bg-gray-700 text-[#012d1d] dark:text-emerald-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <DownloadCloud className="w-4 h-4" /> دانلود شده‌ها ({offlineArticles.length})
        </button>
        <button
          onClick={() => setSubTab('bookmarks')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'bookmarks'
              ? 'bg-white dark:bg-gray-700 text-[#012d1d] dark:text-emerald-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Bookmark className="w-4 h-4" /> نشان‌شده‌ها ({bookmarkedArticles.length})
        </button>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 text-xs">
        <span className="text-gray-600 dark:text-gray-300">فضای اشغال شده: <strong>{(kb / 1024).toFixed(1)} مگابایت</strong></span>
        <div className="flex gap-2">
          {subTab === 'offline' && (
            <>
              <button
                onClick={onSaveAllOffline}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold hover:bg-emerald-100"
              >
                ذخیره همه
              </button>
              <button
                onClick={onClearOfflineCache}
                className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-bold hover:bg-red-100 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> پاکسازی
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {subTab === 'offline' ? (
          offlineArticles.length > 0 ? (
            offlineArticles.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                isBookmarked={bookmarkedArticles.some(b => b.id === art.id)}
                isOfflineSaved={true}
                onSelect={onSelectArticle}
                onToggleBookmark={onToggleBookmark}
                onToggleOffline={onToggleOffline}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              هیچ مطلبی برای مطالعه آفلاین ذخیره نشده است.
            </div>
          )
        ) : (
          bookmarkedArticles.length > 0 ? (
            bookmarkedArticles.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                isBookmarked={true}
                isOfflineSaved={offlineArticles.some(o => o.id === art.id)}
                onSelect={onSelectArticle}
                onToggleBookmark={onToggleBookmark}
                onToggleOffline={onToggleOffline}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              هیچ مطلبی نشان نشده است.
            </div>
          )
        )}
      </div>
    </div>
  );
};
