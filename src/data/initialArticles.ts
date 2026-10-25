import { Article, Category } from '../types';
import liveData from './liveData.json';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'همه مطالب' }
];

export const INITIAL_ARTICLES: Article[] = (liveData as unknown) as Article[];
