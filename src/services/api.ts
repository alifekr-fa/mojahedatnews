import { Article } from '../types';
import liveData from '../data/liveData.json';

const API_BASE = 'https://mojahedat.com/wp-json/wp/v2';

function decodeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8230;/g, '…')
    .replace(/&zwnj;/g, '\u200c');
}

function cleanExcerpt(html: string): string {
  if (!html) return '';
  return decodeHtml(
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/این مطلب به صورت خودکار از این صفحه بارنشر گردیده است/g, '')
      .replace(/\[&hellip;\]/g, '...')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function parseBlocks(html: string): Array<{ type: 'paragraph' | 'heading' | 'quote' | 'callout'; text: string; cite?: string }> {
  if (!html) return [];
  const cleaned = html
    .replace(/<div id="mediaad-[^"]*"><\/div>/gi, '')
    .replace(/<div id="pos-article-[^"]*"><\/div>/gi, '')
    .replace(/این مطلب به صورت خودکار از این صفحه بارنشر گردیده است/gi, '');
  return [{ type: 'paragraph', text: cleaned }];
}

export function transformWpPost(p: any): Article {
  const title = decodeHtml(p.title?.rendered || '').trim();
  let lead = cleanExcerpt(p.excerpt?.rendered || '');
  if (!lead || lead.length < 10) lead = cleanExcerpt(p.content?.rendered || '').slice(0, 180) + '…';
  
  const mediaUrl = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/logo.svg';
  const authorObj = p._embedded?.author?.[0];
  const authorName = authorObj?.name || 'تحریریه مجاهدت';
  const authorAvatar = authorObj?.avatar_urls?.['96'] || authorObj?.avatar_urls?.['48'] || '/icon.svg';

  let catTitle = 'اخبار';
  if (p._embedded?.['wp:term']) {
    const terms = p._embedded['wp:term'];
    for (const taxonomy of terms) {
      if (Array.isArray(taxonomy)) {
        for (const term of taxonomy) {
          if (term.taxonomy === 'category') {
            catTitle = term.name;
            break;
          }
        }
      }
    }
  }

  const blocks = parseBlocks(p.content?.rendered || '');
  return {
    id: String(p.id),
    title,
    subtitle: catTitle,
    slug: p.slug || `post-${p.id}`,
    category: 'all',
    categoryTitle: catTitle,
    author: {
      name: authorName,
      role: 'پایگاه نشر مطالب دفاع مقدس',
      avatar: authorAvatar,
    },
    publishedAt: 'امروز',
    readTimeMinutes: Math.max(2, Math.round(((p.content?.rendered || '').split(/\s+/).length) / 120)),
    audioDurationSeconds: 0,
    featuredImage: mediaUrl,
    lead,
    content: blocks,
    tags: [],
    sizeKb: Math.max(45, Math.round((p.content?.rendered?.length || 500) / 100)),
    isPrecached: true,
  };
}

export async function fetchLiveArticles(perPage: number = 30): Promise<Article[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);
    const response = await fetch(`${API_BASE}/posts?_embed=1&per_page=${perPage}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const posts = await response.json();
    
    if (Array.isArray(posts) && posts.length > 0) {
      const excludeCategory = 'اطلاعات عمومی'.trim();
      const filteredPosts = posts.filter(p => {
        if (!excludeCategory) return true;
        const terms = p._embedded?.['wp:term'] || [];
        for (const taxonomy of terms) {
          if (Array.isArray(taxonomy)) {
            for (const term of taxonomy) {
              if (term.name && term.name.trim() === excludeCategory) {
                return false;
              }
            }
          }
        }
        return true;
      });

      return filteredPosts.map(transformWpPost);
    }
    return (liveData as unknown) as Article[];
  } catch (error) {
    return (liveData as unknown) as Article[];
  }
}

export function getDefaultArticles(): Article[] {
  return (liveData as unknown) as Article[];
}
