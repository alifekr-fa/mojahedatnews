import React, { useState, useEffect } from 'react';
import { ArrowRight, Bookmark, BookmarkCheck, ArrowDownToLine, Check, Share2, Type } from 'lucide-react';
import { Article, ReadingPreferences } from '../types';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  isBookmarked: boolean;
  isOfflineSaved: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleOffline: (a: Article) => void;
  readingPrefs: ReadingPreferences;
  onUpdateReadingPrefs: (p: Partial<ReadingPreferences>) => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  isBookmarked,
  isOfflineSaved,
  onToggleBookmark,
  onToggleOffline,
  readingPrefs,
  onUpdateReadingPrefs,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('reader-scroll-container');
      if (el) {
        const total = el.scrollHeight - el.clientHeight;
        setScrollProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
      }
    };
    const container = document.getElementById('reader-scroll-container');
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const textSizeClass = {
    small: 'text-[14px] leading-[28px]',
    medium: 'text-[16px] leading-[32px]',
    large: 'text-[18px] leading-[36px]',
    xlarge: 'text-[21px] leading-[42px]',
  }[readingPrefs.fontSize] || 'text-[16px] leading-[32px]';

  const handleShare = () => {
    const appArticleUrl = `https://app.mojahedat.com/?articleId=${article.id}`;
    const cleanLead = (article.lead || '').replace(/<[^>]*>/g, '').trim();
    const shareText = `${article.title}\n\n${cleanLead}\n\n📲 مشاهده در اپلیکیشن مجاهدت:\n${appArticleUrl}`;
    if (navigator.share) {
      navigator.share({ title: article.title, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const getThemeWrapperClass = () => {
    if (readingPrefs.theme === 'sepia') return 'reading-mode-sepia bg-[#fbf0d9] text-[#3b2f2f]';
    if (readingPrefs.theme === 'dark') return 'reading-mode-dark bg-[#121815] text-[#e0e3e7]';
    return 'bg-[#f7fafd] text-[#181c1f]';
  };

  const getCardBgClass = () =>
    readingPrefs.theme === 'sepia'
      ? 'bg-[#f4e5c3] border-[#7d562d]/20'
      : readingPrefs.theme === 'dark'
      ? 'bg-[#1b2420] border-white/10'
      : 'bg-white border-gray-200';

  const authorAvatarSrc = article.author?.avatar && article.author.avatar.startsWith('http') 
    ? article.author.avatar 
    : '/icon.svg';

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col ${getThemeWrapperClass()} select-text font-sans`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 z-[110]">
        <div className="h-full bg-emerald-600 transition-all" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="sticky top-0 z-[110] bg-[#012d1d] text-white px-3 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <div className="min-w-0">
            <span className="text-[11px] block font-medium opacity-80">{article.categoryTitle}</span>
            <span className="text-xs font-bold truncate block max-w-[190px]">{article.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowTypographyMenu(!showTypographyMenu)} className="p-1.5 rounded-full hover:bg-white/20">
            <Type className="w-4 h-4" />
          </button>
          <button onClick={() => onToggleOffline(article)} className="p-1.5 rounded-full hover:bg-white/20">
            {isOfflineSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <ArrowDownToLine className="w-4 h-4" />}
          </button>
          <button onClick={() => onToggleBookmark(article.id)} className="p-1.5 rounded-full hover:bg-white/20">
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-yellow-300" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button onClick={handleShare} className="p-1.5 rounded-full hover:bg-white/20">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showTypographyMenu && (
        <div className="bg-gray-800 text-white px-4 py-3 shadow-lg flex flex-col gap-3 z-[120]">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium">تم مطالعه:</span>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateReadingPrefs({ theme: 'light' })}
                className={`px-3 py-1 rounded-lg text-xs ${readingPrefs.theme === 'light' ? 'bg-white text-black font-bold' : 'bg-white/10'}`}
              >
                روز
              </button>
              <button
                onClick={() => onUpdateReadingPrefs({ theme: 'sepia' })}
                className={`px-3 py-1 rounded-lg text-xs ${readingPrefs.theme === 'sepia' ? 'bg-[#ffca98] text-black font-bold' : 'bg-white/10'}`}
              >
                کاغذی
              </button>
              <button
                onClick={() => onUpdateReadingPrefs({ theme: 'dark' })}
                className={`px-3 py-1 rounded-lg text-xs ${readingPrefs.theme === 'dark' ? 'bg-black text-white border font-bold' : 'bg-white/10'}`}
              >
                شب
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-xs font-medium">اندازه قلم:</span>
            <div className="flex gap-1.5">
              {(['small', 'medium', 'large', 'xlarge'] as const).map((sz, i) => (
                <button
                  key={sz}
                  onClick={() => onUpdateReadingPrefs({ fontSize: sz })}
                  className={`w-8 h-8 rounded-lg text-xs font-bold ${readingPrefs.fontSize === sz ? 'bg-[#012d1d] text-white' : 'bg-white/10'}`}
                >
                  {['۱', '۲', '۳', '۴'][i]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div id="reader-scroll-container" className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full pb-28 scroll-smooth font-sans">
        <h1 className="text-xl sm:text-2xl font-extrabold leading-snug mb-3">{article.title}</h1>
        
        <div className={`p-3.5 rounded-xl border flex items-center justify-between mb-5 ${getCardBgClass()}`}>
          <div className="flex items-center gap-3">
            <img
              src={authorAvatarSrc}
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 bg-gray-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
            <div>
              <div className="text-sm font-bold">{article.author.name}</div>
              <div className="text-[11px] opacity-75">{article.author.role}</div>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-6 aspect-16/10 shadow-sm">
          <img src={article.featuredImage} alt="Cover" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }} />
        </div>

        <div className="border-r-4 border-[#012d1d] pr-3.5 my-5 text-base font-semibold leading-relaxed opacity-95">
          {article.lead}
        </div>

        {isOfflineSaved && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 mb-6 border border-emerald-200 dark:border-emerald-900">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>این مطلب کامل در حافظه گوشی ذخیره شده است.</span>
          </div>
        )}

        <div id="wp-content-container" className={`space-y-4 ${textSizeClass} [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_iframe]:w-full [&_img]:mx-auto [&_img]:rounded-xl font-sans`}>
          {article.content.map((block, idx) => {
            const formatLinks = (content: string) => {
              return content
                .replace(/src=["']\/([^"']+)["']/gi, 'src="https://mojahedat.com/$1"')
                .replace(/href=["']\/([^"']+)["']/gi, 'href="https://mojahedat.com/$1"');
            };

            const handleLinkClick = (e: React.MouseEvent<HTMLElement>) => {
              const target = (e.target as HTMLElement).closest('a');
              if (target && target.href) {
                e.preventDefault();
                e.stopPropagation();
                try {
                  const url = new URL(target.href);
                  if (url.hostname.includes('mojahedat.com')) {
                    const pageId = url.searchParams.get('page_id') || url.searchParams.get('p');
                    if (pageId) {
                      window.location.assign(`/?articleId=${pageId}`);
                    } else {
                      const parts = url.pathname.split('/').filter(Boolean);
                      const slug = parts[parts.length - 1];
                      if (slug && !url.pathname.startsWith('/category/') && !url.pathname.startsWith('/tag/')) {
                        window.location.assign(`/?slug=${slug}`);
                      } else {
                        window.open(target.href, '_blank', 'noopener,noreferrer');
                      }
                    }
                  } else {
                    window.open(target.href, '_blank', 'noopener,noreferrer');
                  }
                } catch (err) {
                  window.open(target.href, '_blank', 'noopener,noreferrer');
                }
              }
            };

            return (
              <div
                key={idx}
                className="text-justify leading-relaxed [&_a]:text-emerald-700 dark:[&_a]:text-emerald-400 [&_a]:underline select-text font-sans"
                onClick={handleLinkClick}
                dangerouslySetInnerHTML={{ __html: formatLinks(block.text) }}
              />
            );
          })}
        </div>
      </div>

      {copiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[150] bg-gray-900 text-white px-4 py-2 rounded-xl text-xs shadow-xl flex items-center gap-2">
          <span>لینک مطلب کپی شد</span>
        </div>
      )}
    </div>
  );
};
