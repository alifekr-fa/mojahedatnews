import React from 'react';
import { Bookmark, BookmarkCheck, Check, DownloadCloud, Clock } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  isBookmarked: boolean;
  isOfflineSaved: boolean;
  onSelect: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  onToggleOffline: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isBookmarked,
  isOfflineSaved,
  onSelect,
  onToggleBookmark,
  onToggleOffline,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 font-sans transition-colors">
      <div
        className="w-full aspect-[16/10] rounded-xl overflow-hidden relative bg-gray-100 dark:bg-gray-700 cursor-pointer group shrink-0"
        onClick={() => onSelect(article)}
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/icon.svg'; }}
        />
      </div>

      <div
        className="flex-1 flex flex-col cursor-pointer px-1"
        onClick={() => onSelect(article)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
            {article.categoryTitle}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 font-medium">
            <Clock className="w-3 h-3" /> {article.readTimeMinutes} دقیقه مطالعه
          </span>
        </div>
        <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 leading-relaxed line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {article.title}
        </h3>
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-3 px-1 mt-1">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-2.5 py-1.5 rounded-lg flex items-center text-[11px] text-gray-500 dark:text-gray-400 font-medium border border-gray-100 dark:border-gray-700">
          حجم: {article.sizeKb} کیلوبایت
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleOffline(article); }}
            className={`p-2 rounded-xl transition-colors flex items-center justify-center ${isOfflineSaved ? 'bg-[#d1fae5] dark:bg-emerald-900/40 text-[#059669]' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
            title={isOfflineSaved ? "حذف از حافظه" : "دانلود برای مطالعه آفلاین"}
          >
            {isOfflineSaved ? <Check className="w-4 h-4" /> : <DownloadCloud className="w-4 h-4" />}
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(article.id); }}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
            title="نشان کردن"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
