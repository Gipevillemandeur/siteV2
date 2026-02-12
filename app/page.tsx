'use client';

import HeroSection from '@/components/HeroSection';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { EventRow, NewsRow } from '@/lib/types';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const getExcerpt = (text: string, limit = 5) =>
  text.split(' ').slice(0, limit).join(' ') + '...';

function driveShareToDirect(link: string): string {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return link;
}

export default function Home() {
  const [latestNews, setLatestNews] = useState<NewsRow[]>([]);
  const [nextEvents, setNextEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  async function fetchNews() {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })
      .limit(2);

    const rows = (data ?? []) as NewsRow[];
    setLatestNews(rows);
  }

  async function fetchEvents() {
    const today = new Date().toISOString().slice(0, 10);

    const { data } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(2);

    const rows = (data ?? []) as EventRow[];
    setNextEvents(rows);
  }

  return (
    <>
      <HeroSection />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ACTUALITÉS */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-maroon mb-2">
                Actualités
              </h2>
              <div className="w-12 h-1 bg-gold mb-6 rounded"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/actualites/${item.id}`}
                    className="block"
                  >
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                      {item.image_url && (
                        <div className="relative w-full h-40">
                          <Image
                            src={driveShareToDirect(item.image_url)}
                            alt={item.title ?? 'Illustration actualité'}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="p-5">
                        {item.category && (
                          <span className="bg-gold text-maroon px-3 py-1 rounded text-sm font-bold mb-2 inline-block">
                            {item.category}
                          </span>
                        )}

                        <h3 className="text-lg font-bold text-maroon leading-tight mb-2">
                          {item.title}
                        </h3>

                        <p className="text-gray-700 text-sm">
                          {getExcerpt(item.content || '')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* AGENDA */}
            <div className="bg-maroon text-white p-8 rounded-3xl shadow-lg flex flex-col h-full">
              <h2 className="text-3xl font-bold text-white mb-2">
                Agenda
              </h2>
              <div className="w-12 h-1 bg-gold mb-6 rounded"></div>

              <div className="space-y-4">
                {nextEvents.length > 0 ? (
                  nextEvents.map((event) => {
                    const d = new Date(event.date ?? '');
                    const day = d.getDate().toString().padStart(2, '0');
                    const month = d
                      .toLocaleString('fr-FR', { month: 'short' })
                      .toUpperCase();

                    return (
                      <div key={event.id} className="flex items-center gap-4">
                        <div className="bg-white text-maroon rounded-lg px-3 py-2 text-center w-14">
                          <p className="font-bold text-sm">{day}</p>
                          <p className="text-xs">{month}</p>
                        </div>
                        <p className="font-semibold">{event.title}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-200">
                    Aucun événement à venir.
                  </p>
                )}
              </div>

              <div className="mt-auto flex justify-end">
                <Link
                  href="/agenda"
                  className="bg-white text-maroon px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Voir tout l’agenda
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

