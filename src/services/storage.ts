import { Article, ReadingPreferences } from '../types';

const OFFLINE_KEY = 'pwa_offline_articles_v1';
const BOOKMARKS_KEY = 'pwa_bookmarked_ids_v1';
const PREFS_KEY = 'pwa_reading_prefs_v1';

const DEFAULT_PREFS: ReadingPreferences = {
  theme: 'light',
  fontSize: 'medium',
};

export function initOfflineStore(): void {
  try {
    if (!localStorage.getItem(OFFLINE_KEY)) localStorage.setItem(OFFLINE_KEY, JSON.stringify([]));
    if (!localStorage.getItem(BOOKMARKS_KEY)) localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([]));
    if (!localStorage.getItem(PREFS_KEY)) localStorage.setItem(PREFS_KEY, JSON.stringify(DEFAULT_PREFS));
  } catch (e) {}
}

export function getOfflineArticles(): Article[] {
  try {
    const raw = localStorage.getItem(OFFLINE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveArticleOffline(article: Article): void {
  try {
    const list = getOfflineArticles();
    const filtered = list.filter((a) => String(a.id) !== String(article.id));
    filtered.unshift(article);
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(filtered));
  } catch (e) {}
}

export function removeArticleOffline(id: string): void {
  try {
    const list = getOfflineArticles().filter((a) => String(a.id) !== String(id));
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(list));
  } catch (e) {}
}

export function clearOfflineCache(): void {
  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify([]));
  } catch (e) {}
}

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleBookmark(id: string): boolean {
  try {
    const list = getBookmarks();
    const exists = list.includes(id);
    const updated = exists ? list.filter((item) => item !== id) : [id, ...list];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return !exists;
  } catch (e) {
    return false;
  }
}

export function getReadingPrefs(): ReadingPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch (e) {
    return DEFAULT_PREFS;
  }
}

export function saveReadingPrefs(updated: Partial<ReadingPreferences>): ReadingPreferences {
  try {
    const current = getReadingPrefs();
    const next = { ...current, ...updated };
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    return next;
  } catch (e) {
    return DEFAULT_PREFS;
  }
}

export function getStorageStats(): { usedKb: number } {
  try {
    const articles = getOfflineArticles();
    const totalKb = articles.reduce((sum, a) => sum + (a.sizeKb || 45), 0);
    return { usedKb: totalKb };
  } catch (e) {
    return { usedKb: 0 };
  }
}
