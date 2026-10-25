import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';
import { OfflineLibrary } from './components/OfflineLibrary';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { PageViewer } from './components/PageViewer';
import { Article, ReadingPreferences } from './types';
import { INITIAL_ARTICLES } from './data/initialArticles';
import { fetchLiveArticles, transformWpPost } from './services/api';
import { initOfflineStore, getOfflineArticles, saveArticleOffline, removeArticleOffline, clearOfflineCache, getBookmarks, toggleBookmark as toggleBookmarkStorage, getReadingPrefs, saveReadingPrefs, getStorageStats } from './services/storage';
import { CheckCircle2, Download, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activePageId, setActivePageId] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFramed, setIsFramed] = useState(true);
  const [allArticles, setAllArticles] = useState<Article[]>(INITIAL_ARTICLES || []);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('هم‌اکنون');
  const [offlineArticles, setOfflineArticles] = useState<Article[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [readingPrefs, setReadingPrefs] = useState<ReadingPreferences>(getReadingPrefs());
  const [storageKb, setStorageKb] = useState<number>(0);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  const customLinks = [
    {
        "title": "درباره ما | مجاهدت",
        "url": "https://mojahedat.com/?page_id=274"
    },
    {
        "title": "شهید نوید صفری",
        "url": "https://mojahedat.com/?page_id=331823"
    },
    {
        "title": "مجاهدت مدیا",
        "url": "https://mojahedat.com/?page_id=133054"
    },
    {
        "title": "رنگ آفرین ها",
        "url": "https://mojahedat.com/?page_id=133055"
    }
];

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBtn(false);
    setInstallPrompt(null);
  };

  const refreshStorageData = useCallback(() => {
    try {
      setOfflineArticles(getOfflineArticles() || []);
      setBookmarkedIds(getBookmarks() || []);
      const stats = getStorageStats();
      setStorageKb(stats?.usedKb || 0);
    } catch (e) {
      setOfflineArticles([]);
      setBookmarkedIds([]);
      setStorageKb(0);
    }
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const loadArticleByApi = (post: any) => {
    const transformed = transformWpPost(post);
    if (typeof transformed.lead === 'string') transformed.lead = transformed.lead.replace(/\[&hellip;\]/g, '...');
    setActiveArticle(transformed);
  };

  const handleSyncLiveData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const livePosts = await fetchLiveArticles(30); 
      if (livePosts && livePosts.length > 0) {
        const processedPosts = livePosts.map((p) => {
          const newPost = { ...p };
          if (typeof newPost.lead === 'string') newPost.lead = newPost.lead.replace(/\[&hellip;\]/g, '...');
          return newPost;
        });
        setAllArticles(processedPosts);
        processedPosts.slice(0, 6).forEach((p) => saveArticleOffline(p));
        refreshStorageData();
        const now = new Date();
        setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
        showToast('مطالب با موفقیت به‌روزرسانی شدند.');
      }
    } catch (error) {
      showToast('خطا در دریافت اطلاعات. از محتوای ذخیره‌شده استفاده می‌شود.');
    } finally {
      setIsSyncing(false);
    }
  }, [refreshStorageData]);

  useEffect(() => {
    try { initOfflineStore(); } catch (e) {}
    refreshStorageData();
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      handleSyncLiveData();
    }
  }, [handleSyncLiveData, refreshStorageData]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('articleId');
    const targetSlug = urlParams.get('slug');

    if (targetId) {
      const localFound = allArticles.find((a) => String(a.id) === String(targetId));
      if (localFound) { setActiveArticle(localFound); return; }
      const offlineFound = getOfflineArticles().find((a) => String(a.id) === String(targetId));
      if (offlineFound) { setActiveArticle(offlineFound); return; }
      fetch(`https://mojahedat.com/wp-json/wp/v2/posts/${targetId}?_embed=1`)
        .then(res => res.ok ? res.json() : null)
        .then(post => { if (post) loadArticleByApi(post); }).catch(() => {});
    } else if (targetSlug) {
      const localFound = allArticles.find((a) => String(a.slug) === String(targetSlug));
      if (localFound) { setActiveArticle(localFound); return; }
      fetch(`https://mojahedat.com/wp-json/wp/v2/posts?slug=${targetSlug}&_embed=1`)
        .then(res => res.ok ? res.json() : null)
        .then(posts => { if (posts && posts.length > 0) loadArticleByApi(posts[0]); }).catch(() => {});
    }
  }, [allArticles]);

  const handleToggleOffline = (article: Article) => {
    if (offlineArticles.some((a) => a.id === article.id)) {
      removeArticleOffline(article.id);
      showToast('از لیست آفلاین حذف شد.');
    } else {
      saveArticleOffline(article);
      showToast('برای مطالعه آفلاین ذخیره شد.');
    }
    refreshStorageData();
  };

  const handleToggleBookmark = (id: string) => {
    showToast(toggleBookmarkStorage(id) ? 'به نشان‌شده‌ها اضافه شد.' : 'از نشان‌شده‌ها حذف شد.');
    refreshStorageData();
  };

  const handleUpdateReadingPrefs = (updated: Partial<ReadingPreferences>) => {
    setReadingPrefs(saveReadingPrefs(updated));
  };

  const bookmarkedArticles = useMemo(() => allArticles.filter((a) => bookmarkedIds.includes(a.id)), [allArticles, bookmarkedIds]);
  const heroArticle = allArticles[0] || null;
  const homeAnalyticArticles = allArticles.slice(1);
  const getThemeClass = () => readingPrefs.theme === 'dark' ? 'dark bg-[#121815] text-[#f7fafd]' : readingPrefs.theme === 'sepia' ? 'reading-mode-sepia bg-[#fbf0d9] text-[#3b2f2f]' : 'bg-[#f7fafd] text-[#181c1f]';

  const CustomFooter = () => (
    <div className="mt-8 mb-6 border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col items-center gap-2 font-sans">
      <p className="text-[11px] text-gray-500 font-bold">مجاهدت - پایگاه نشر مطالب دفاع مقدس</p>
      <p className="text-[10px] text-gray-400 opacity-70">تمام حقوق محفوظ است</p>
    </div>
  );

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start transition-colors font-sans ${isFramed ? 'py-0 sm:py-6 bg-gray-900' : 'bg-[#f7fafd]'}`}>
      <div className={`w-full flex flex-col relative transition-all ${isFramed ? 'max-w-[440px] sm:rounded-[36px] sm:shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:border-[8px] border-[#012d1d] overflow-hidden min-h-[100dvh] sm:min-h-[860px]' : 'max-w-xl min-h-screen shadow-md'}`}>
        <div className={`w-full h-full flex flex-col overflow-hidden ${getThemeClass()}`}>
          
          <Header onOpenSearch={() => setIsSearchOpen(true)} isFramed={isFramed} onToggleFrame={() => setIsFramed(!isFramed)} onSyncLiveData={handleSyncLiveData} isSyncing={isSyncing} />
          
          <main className="flex-1 overflow-y-auto px-3.5 py-4 scroll-smooth font-sans relative">
            {activeTab === 'home' && (
              <div className="space-y-4 pb-28">
                {heroArticle && (
                  <div onClick={() => setActiveArticle(heroArticle)} className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer group bg-black">
                    <div className="aspect-16/10 w-full relative">
                      <img src={heroArticle.featuredImage} alt={heroArticle.title} className="w-full h-full object-cover opacity-85" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-4 text-white z-10">
                      <h2 className="text-base sm:text-lg font-extrabold leading-tight mb-2">{heroArticle.title}</h2>
                      {heroArticle.lead && <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed opacity-90">{heroArticle.lead}</p>}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3.5">
                  {homeAnalyticArticles.map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      isBookmarked={bookmarkedIds.includes(art.id)}
                      isOfflineSaved={offlineArticles.some((o) => o.id === art.id)}
                      onSelect={setActiveArticle}
                      onToggleBookmark={handleToggleBookmark}
                      onToggleOffline={handleToggleOffline}
                    />
                  ))}
                </div>
                <CustomFooter />
              </div>
            )}
            
            {activeTab === 'feed' && (
              <div className="space-y-4 pb-28">
                <div className="grid grid-cols-1 gap-3.5">
                  {allArticles.map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      isBookmarked={bookmarkedIds.includes(art.id)}
                      isOfflineSaved={offlineArticles.some((o) => o.id === art.id)}
                      onSelect={setActiveArticle}
                      onToggleBookmark={handleToggleBookmark}
                      onToggleOffline={handleToggleOffline}
                    />
                  ))}
                </div>
                <CustomFooter />
              </div>
            )}

            {activeTab === 'links' && (
              <div className="space-y-4 pb-28 animate-in fade-in duration-200 px-1 pt-2 font-sans">
                <h3 className="text-sm font-extrabold mb-4 px-1 text-[#012d1d] dark:text-emerald-400">پیوندها و صفحات ویژه</h3>
                <div className="space-y-3">
                  {customLinks.map((l, idx) => (
                    <button
                      key={idx}
                      onClick={() => window.open(l.url, '_blank')}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-bold text-gray-700 dark:text-gray-200"
                    >
                      <span>{l.title}</span>
                      <ExternalLink className="w-4 h-4 opacity-50 text-emerald-700" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'offline' && (
              <OfflineLibrary
                offlineArticles={offlineArticles}
                bookmarkedArticles={bookmarkedArticles}
                onSelectArticle={setActiveArticle}
                onToggleBookmark={handleToggleBookmark}
                onToggleOffline={handleToggleOffline}
                onSaveAllOffline={() => { allArticles.forEach(a => saveArticleOffline(a)); refreshStorageData(); showToast('همه مطالب ذخیره شدند.'); }}
                onClearOfflineCache={() => { clearOfflineCache(); refreshStorageData(); showToast('حافظه پاکسازی شد.'); }}
                totalStorageKb={storageKb}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsModal
                readingPrefs={readingPrefs}
                onUpdateReadingPrefs={handleUpdateReadingPrefs}
                totalStorageKb={storageKb}
                offlineCount={offlineArticles.length}
                onSaveAllOffline={() => { allArticles.forEach(a => saveArticleOffline(a)); refreshStorageData(); showToast('همه مطالب ذخیره شدند.'); }}
                onClearOfflineCache={() => { clearOfflineCache(); refreshStorageData(); showToast('حافظه پاکسازی شد.'); }}
                onSyncLiveData={handleSyncLiveData}
                isSyncing={isSyncing}
                lastSyncTime={lastSyncTime}
              />
            )}
          </main>

          {activeArticle && (
            <ArticleReader
              article={activeArticle}
              onBack={() => setActiveArticle(null)}
              isBookmarked={bookmarkedIds.includes(activeArticle.id)}
              isOfflineSaved={offlineArticles.some((o) => o.id === activeArticle.id)}
              onToggleBookmark={handleToggleBookmark}
              onToggleOffline={handleToggleOffline}
              readingPrefs={readingPrefs}
              onUpdateReadingPrefs={handleUpdateReadingPrefs}
            />
          )}

          {activePageId && <PageViewer pageId={activePageId} onBack={() => setActivePageId(null)} />}

          {showInstallBtn && (
            <button onClick={handleInstallApp} className="fixed bottom-24 left-4 z-[110] bg-[#012d1d] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm animate-bounce border border-white/20">
              <Download className="w-4 h-4" /> نصب اپلیکیشن
            </button>
          )}

          <div className="relative z-[90]">
            <BottomNav
              activeTab={activeTab}
              onChangeTab={(tab) => {
                setActiveTab(tab);
                setActiveArticle(null);
                setActivePageId(null);
              }}
              offlineCount={offlineArticles.length}
            />
          </div>

          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} articles={allArticles} onSelectArticle={setActiveArticle} offlineArticleIds={offlineArticles.map((o) => o.id)} />

          {feedbackToast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[140] bg-gray-900 text-white px-4 py-2 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{feedbackToast}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
