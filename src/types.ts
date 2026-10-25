export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
}

export interface ReadingPreferences {
  theme: 'light' | 'sepia' | 'dark';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface ArticleBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'callout';
  text: string;
  cite?: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: CategoryId;
  categoryTitle: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  audioDurationSeconds: number;
  featuredImage: string;
  lead: string;
  content: ArticleBlock[];
  tags: string[];
  sizeKb: number;
  isPrecached: boolean;
}
