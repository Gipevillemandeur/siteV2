export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
}

export interface SettingRow {
  key: string;
  value: string | null;
}

export type SettingsMap = Record<string, string>;

export interface NewsRow {
  id: string | number;
  title: string | null;
  content: string | null;
  category: string | null;
  image_url?: string | null;
  date?: string | null;
  author?: string | null;
}

export interface EventRow {
  id: string | number;
  title: string | null;
  description: string | null;
  date: string | null;
  time?: string | null;
  location?: string | null;
  image_url?: string | null;
  category?: string | null;
}

export interface DocumentRow {
  id: string | number;
  title: string | null;
  description?: string | null;
  file_url?: string | null;
  thumbnail_url?: string | null;
  date?: string | null;
  category?: string | null;
}
