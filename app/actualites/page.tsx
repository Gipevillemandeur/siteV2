'use client';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaUser } from 'react-icons/fa';
import type { NewsRow } from '@/lib/types';
import { useState, useEffect, useMemo } from 'react';

function getExcerpt(text: string) {
  return text?.split(' ').slice(0, 7).join(' ') + '...';
}

function driveShareToDirect(link: string): string {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return link;
}

// Transformer l'image Cloudinary pour l'ajuster au conteneur sans cropper
function getContainedImage(imageUrl: string): string {
  if (imageUrl.includes('cloudinary.com') && imageUrl.includes('/upload/')) {
    // Remplacer c_fill par c_pad pour afficher l'image complète avec fond blanc
    return imageUrl
      .replace(/\/upload\/w_\d+,h_\d+,c_fill,q_auto\//, '/upload/w_192,h_192,c_pad,b_rgb:ffffff,q_auto/')
      .replace(/\/upload\/f_jpg,pg_1,w_\d+,h_\d+,c_fill,q_auto\//, '/upload/f_jpg,pg_1,w_192,h_192,c_pad,b_rgb:ffffff,q_auto/');
  }
  return imageUrl;
}

export default function ActualitesPage() {
  const [news, setNews] = useState<NewsRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // ===== FETCH SUPABASE =====
  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });

      const rows = (data ?? []) as NewsRow[];
      setNews(rows);
    }

    fetchNews();
  }, []);

  // ===== CATEGORIES =====
  const categories = useMemo(() => {
    const categoryList = news
      .map((item) => item.category)
      .filter((value): value is string => Boolean(value));

    return ['Tous', ...new Set(categoryList)];
  }, [news]);

  // ===== FILTRAGE =====
  const filteredNews = useMemo(() => {
    return news.filter((item) =>
      selectedCategory === 'Tous' ? true : item.category === selectedCategory
    );
  }, [news, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-maroon hover:text-gold transition mb-8">
          <FaArrowLeft /> Retour
        </Link>

        <h1 className="text-4xl font-bold text-maroon mb-12">
          Actualités
        </h1>

        {/* PASTILLES CATEGORIES */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition
                ${
                  selectedCategory === cat
                    ? 'bg-gold text-maroon'
                    : 'bg-maroon/10 text-maroon hover:bg-gold/60'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {filteredNews.map((item) => (
            <Link
              key={item.id}
              href={`/actualites/detail?id=${item.id}`}
              className="block"
            >
              <article className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-gold">
                <div className="flex flex-col md:flex-row gap-6">
                  {item.image_url && (
                    <div className="relative w-full md:w-48 h-48 bg-white rounded overflow-hidden">
                      <Image
                        src={getContainedImage(driveShareToDirect(item.image_url))}
                        alt={item.title ?? 'Illustration actualité'}
                        fill
                        className="object-contain"
                        sizes="(min-width: 768px) 192px, 100vw"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    {item.category && (
                      <span className="bg-gold text-maroon px-3 py-1 rounded text-sm font-bold">
                        {item.category}
                      </span>
                    )}

                    <h2 className="text-2xl font-bold text-maroon mt-2 mb-2">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 mb-3">
                      {getExcerpt(item.content || '')}
                    </p>

                    <div className="flex gap-4 text-sm text-gray-500">
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <FaCalendar />
                          {new Date(item.date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {item.author && (
                        <span className="flex items-center gap-1">
                          <FaUser /> {item.author}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
