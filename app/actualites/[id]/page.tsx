import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCalendar, FaUser } from 'react-icons/fa';
import type { NewsRow } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchSupabase<T>(path: string): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [] as unknown as T;
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!res.ok) {
    return [] as unknown as T;
  }

  return res.json() as Promise<T>;
}

function driveShareToDirect(link: string): string {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return link;
}

// Transformer l'image pour l'afficher complète dans un conteneur raisonnable
function getContainedImage(imageUrl: string): string {
  if (imageUrl.includes('cloudinary.com') && imageUrl.includes('/upload/')) {
    // Version carrée 672x672 sans padding pour laisser le fond du conteneur visible
    return imageUrl
      .replace(/\/upload\/w_\d+,h_\d+,c_fill,q_auto\//, '/upload/w_672,h_672,c_fit,q_auto/')
      .replace(/\/upload\/f_jpg,pg_1,w_\d+,h_\d+,c_fill,q_auto\//, '/upload/f_jpg,pg_1,w_672,h_672,c_fit,q_auto/')
      .replace(/\/upload\/w_\d+,q_auto\//, '/upload/w_672,h_672,c_fit,q_auto/')
      .replace(/\/upload\/f_jpg,pg_1,w_\d+,q_auto\//, '/upload/f_jpg,pg_1,w_672,h_672,c_fit,q_auto/');
  }
  return imageUrl;
}

export const generateStaticParams = async () => {
  const rows = await fetchSupabase<Array<{ id: string | number }>>('news?select=id');

  return rows.map((row) => ({ id: String(row.id) }));
};

export const dynamicParams = false;

export default async function ActualitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rows = await fetchSupabase<NewsRow[]>(`news?id=eq.${encodeURIComponent(id)}&select=*`);
  const article = rows?.[0] ?? null;

  if (!article) {
    notFound();
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
