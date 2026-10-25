import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Article } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  offlineArticleIds: string[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, articles, onSelectArticle }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return articles.filter(a => a.title.toLowerCase().includes(q) || (a.lead && a.lead.toLowerCase().includes(q)));
  }, [query, articles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-xs flex flex-col p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full mx-auto overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در عناوین و متن اخبار..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 dark:text-gray-100"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-xs text-gray-400">عبارت مورد نظر خود را بنویسید...</div>
          ) : results.length > 0 ? (
            results.map(art => (
              <div
                key={art.id}
                onClick={() => { onSelectArticle(art); onClose(); }}
                className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer border border-gray-100 dark:border-gray-700 transition-colors"
              >
                <div className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-1">{art.title}</div>
                <div className="text-[11px] text-gray-500 line-clamp-1">{art.lead}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-gray-400">مطلبی با این عبارت یافت نشد.</div>
          )}
        </div>
      </div>
    </div>
  );
};
