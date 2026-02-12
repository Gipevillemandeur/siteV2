'use client';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';
import type { EventRow } from '@/lib/types';
import { useState, useEffect, useMemo } from 'react';

// Transformer l'image Cloudinary pour l'ajuster au conteneur sans cropper
function getContainedImage(imageUrl: string): string {
  if (imageUrl.includes('cloudinary.com') && imageUrl.includes('/upload/')) {
    // Remplacer c_fill par c_pad pour afficher l'image complète avec fond beige
    return imageUrl
      .replace(/\/upload\/w_\d+,h_\d+,c_fill,q_auto\//, '/upload/w_192,h_192,c_pad,b_rgb:fffbeb,q_auto/')
      .replace(/\/upload\/f_jpg,pg_1,w_\d+,h_\d+,c_fill,q_auto\//, '/upload/f_jpg,pg_1,w_192,h_192,c_pad,b_rgb:fffbeb,q_auto/');
  }
  return imageUrl;
}

export default function AgendaPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // ===== FETCH SUPABASE =====
  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      const rows = (data ?? []) as EventRow[];
      setEvents(rows);
    }

    fetchEvents();
  }, []);

  // ===== MOIS DISPONIBLES =====
  const months = useMemo(() => {
    const monthKeys = events
      .map((event) => (event.date ? event.date.slice(0, 7) : null))
      .filter((value): value is string => Boolean(value));

    return Array.from(new Set(monthKeys)).sort();
  }, [events]);

  // ===== CATEGORIES =====
  const categories = useMemo(() => {
    const categoryList = events
      .map((event) => event.category)
      .filter((value): value is string => Boolean(value));

    return ['Tous', ...new Set(categoryList)];
  }, [events]);

  // ===== FILTRAGE =====
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) =>
        selectedMonth ? (event.date ? event.date.startsWith(selectedMonth) : false) : true
      )
      .filter((event) =>
        selectedCategory === 'Tous'
          ? true
          : event.category === selectedCategory
      );
  }, [events, selectedMonth, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-maroon hover:text-gold transition mb-8">
          <FaArrowLeft /> Retour
        </Link>

        <h1 className="text-4xl font-bold text-maroon mb-8">
          Agenda
        </h1>

        {/* FILTRE MOIS */}
        <div className="mb-6">
          <label className="block text-maroon font-bold mb-2">
            Filtrer par mois :
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white border-2 border-maroon p-2 rounded w-auto"
          >
            <option value="">Tous les mois</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {new Date(`${month}-01`).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </option>
            ))}
          </select>
        </div>

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

        {/* EVENTS */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-gold"
              >
                <div className="flex flex-col md:flex-row gap-6">

                  {event.image_url && (
                    <div className="relative w-full md:w-48 h-48 bg-amber-50 rounded overflow-hidden">
                      <Image
                        src={getContainedImage(event.image_url)}
                        alt={event.title ?? 'Illustration événement'}
                        fill
                        className="object-contain"
                        sizes="(min-width: 768px) 192px, 100vw"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    {event.category && (
                      <span className="bg-gold text-maroon px-3 py-1 rounded text-sm font-bold">
                        {event.category}
                      </span>
                    )}

                    <h2 className="text-2xl font-bold text-maroon mt-2 mb-3">
                      {event.title}
                    </h2>

                    <p className="text-gray-600 mb-4">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-gray-700">
                      {event.date && (
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-gold" />
                          <span>
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}

                      {event.time && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gold" />
                          <span>{event.time}</span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gold" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Aucun événement pour ce filtre.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
