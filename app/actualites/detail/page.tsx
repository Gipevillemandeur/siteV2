'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaCalendar, FaUser } from 'react-icons/fa';
import type { NewsRow } from '@/lib/types';

function driveShareToDirect(link: string): string {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return link;
}

// Transformer l'image pour l'afficher complete dans un conteneur raisonnable
function getContainedImage(imageUrl: string): string {
  if (imageUrl.includes('cloudinary.com') && imageUrl.includes('/upload/')) {
    // Version carree 672x672 sans padding pour laisser le fond du conteneur visible
    return imageUrl
      .replace(/\/upload\/w_\d+,h_\d+,c_fill,q_auto\//, '/upload/w_672,h_672,c_fit,q_auto/')
      .replace(/\/upload\/f_jpg,pg_1,w_\d+,h_\d+,c_fill,q_auto\//, '/upload/f_jpg,pg_1,w_672,h_672,c_fit,q_auto/')
      .replace(/\/upload\/w_\d+,q_auto\//, '/upload/w_672,h_672,c_fit,q_auto/')
      .replace(/\/upload\/f_jpg,pg_1,w_\d+,q_auto\//, '/upload/f_jpg,pg_1,w_672,h_672,c_fit,q_auto/');
  }
  return imageUrl;
}

export default function ActualiteDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [article, setArticle] = useState<NewsRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      setArticle((data as NewsRow) || null);
      setLoading(false);
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!id || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-maroon hover:text-gold transition mb-8"
          >
            <FaArrowLeft /> Retour aux actualites
          </Link>
          <p className="text-gray-600">Actualite introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/actualites"
          className="inline-flex items-center gap-2 text-maroon hover:text-gold transition mb-8"
        >
          <FaArrowLeft /> Retour aux actualites
        </Link>

        {article.image_url && (
          <div className="relative w-full max-w-2xl mx-auto h-[672px] mb-6 overflow-hidden">
            <Image
              src={getContainedImage(driveShareToDirect(article.image_url))}
              alt={article.title ?? 'Illustration actualite'}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
              unoptimized
              priority
            />
          </div>
        )}

        {article.category && (
          <span className="bg-gold text-maroon px-3 py-1 rounded text-sm font-bold">
            {article.category}
          </span>
        )}

        <h1 className="text-3xl font-bold text-maroon mt-3 mb-3">
          {article.title}
        </h1>

        <div className="flex gap-4 text-sm text-gray-500 mb-6">
          {article.date && (
            <span className="flex items-center gap-1">
              <FaCalendar />
              {new Date(article.date).toLocaleDateString('fr-FR')}
            </span>
          )}
          {article.author && (
            <span className="flex items-center gap-1">
              <FaUser /> {article.author}
            </span>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </p>
      </div>
    </div>
  );
}
