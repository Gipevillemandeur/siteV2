'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import { useEffect, useState, useMemo } from 'react';
import type { DocumentRow } from '@/lib/types';
import Image from 'next/image';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    async function fetchDocs() {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .order('date', { ascending: false });

      const rows = (data ?? []) as DocumentRow[];
      setDocs(rows);
    }

    fetchDocs();
  }, []);

  const categories = useMemo(() => {
    const categoryList = docs
      .map((doc) => doc.category)
      .filter((value): value is string => Boolean(value));

    return ['Tous', ...new Set(categoryList)];
  }, [docs]);

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) =>
      selectedCategory === 'Tous'
        ? true
        : doc.category === selectedCategory
    );
  }, [docs, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-maroon hover:text-gold transition mb-8">
          <FaArrowLeft /> Retour
        </Link>

        <h1 className="text-4xl font-bold text-maroon mb-8">
          Documents
        </h1>

        {/* PASTILLES */}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              {/* MINIATURE */}
              <div className="h-48 relative bg-gray-100">
                {doc.thumbnail_url ? (
                  <Image
                    src={doc.thumbnail_url}
                    alt={doc.title || 'Document'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-maroon to-red-800">
                    <div className="text-center text-white">
                      <svg className="w-20 h-20 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-bold">DOCUMENT PDF</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* CONTENU */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {doc.category && (
                    <span className="inline-block bg-gold text-maroon px-2 py-1 rounded text-xs font-bold mb-2">
                      {doc.category}
                    </span>
                  )}
                  <h3 className="font-bold text-lg text-maroon mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {doc.description}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {doc.date ? new Date(doc.date).toLocaleDateString('fr-FR') : ''}
                  </p>
                </div>

                <a
                  href={doc.file_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-maroon text-white py-2 px-4 rounded hover:bg-gold hover:text-maroon transition font-semibold"
                >
                  <FaDownload /> Télécharger
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
