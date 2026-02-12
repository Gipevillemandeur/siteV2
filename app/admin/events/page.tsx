'use client';

import { useEffect, useState, useRef, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { generateImageThumbnail } from '@/lib/cloudinary';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import type { EventRow } from '@/lib/types';
import LogoutButton from '@/components/LogoutButton';
import Image from 'next/image';

export default function AdminEventsPage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [events, setEvents] = useState<EventRow[]>([]);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    const rows = (data ?? []) as EventRow[];
    setEvents(rows);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    let imageUrl = '';

    try {
      // Upload image if selected - Seulement miniature Cloudinary
      if (imageFile) {
        imageUrl = await generateImageThumbnail(imageFile, 'events');
      }
    } catch (err) {
      alert('Erreur upload: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
      setUploading(false);
      return;
    }

    const payload = { title, date, time, location, category, image_url: imageUrl };

    if (editingId) {
      await supabase.from('events').update(payload).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('events').insert([payload]);
    }

    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploading(false);
    fetchEvents();
  }

  function handleEdit(ev: EventRow) {
    setEditingId(ev.id);
    setTitle(ev.title ?? '');
    setDate(ev.date ?? '');
    setTime(ev.time ?? '');
    setLocation(ev.location ?? '');
    setCategory(ev.category ?? 'Événement');
  }

  async function handleDelete(id: string | number) {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet événement ?\n\nCette action est irréversible.')) return;
    
    // Note: Les miniatures Cloudinary restent sur Cloudinary (pas de suppression nécessaire)
    
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  }

  return (
    <div className="p-10 max-w-3xl space-y-8">

      <div className="flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-maroon hover:text-gold">
          <FaArrowLeft /> Retour Admin
        </Link>
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold text-maroon">Agenda</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        
        {editingId && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-4">
            <p className="font-bold">📝 Mode édition</p>
            <p className="text-sm">Vous modifiez un événement existant</p>
          </div>
        )}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre"
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          value={time}
          onChange={e => setTime(e.target.value)}
          placeholder="Heure (ex: 14h00 - 16h00)"
          className="border p-2 w-full"
        />
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Lieu"
          className="border p-2 w-full"
        />

        <div className="space-y-2 border-t pt-4">
          <label className="block text-sm font-semibold text-maroon">Image ou PDF (optionnel) :</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-blue-600">
            ✨ <strong>Miniature automatique :</strong> L&apos;image ou PDF sera optimisé et redimensionné automatiquement.
          </p>
          
          {imageFile && (
            <div className="bg-purple-50 border border-purple-200 p-3 rounded">
              <p className="text-sm font-semibold text-maroon">🖼️ Image sélectionnée :</p>
              <p className="text-sm text-gray-700">{imageFile.name}</p>
            </div>
          )}
        </div>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Sans catégorie</option>
          <option>Information</option>
          <option>GIPE</option>
          <option>Portes Ouvertes</option>
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="bg-maroon text-white px-4 py-2 rounded hover:bg-gold hover:text-maroon flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? '📏 Upload en cours...' : (editingId ? 'Mettre à jour' : 'Ajouter')}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle('');
                setDate('');
                setTime('');
                setLocation('');
                setImageFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                setCategory('Événement');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {events.map(ev => (
        <div key={ev.id} className="flex items-center justify-between bg-white p-4 rounded shadow gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* MINIATURE */}
            {ev.image_url ? (
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={ev.image_url}
                  alt={ev.title || 'Événement'}
                  fill
                  className="object-cover rounded"
                  sizes="64px"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 flex-shrink-0 bg-maroon rounded flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div>
              <p className="font-bold">{ev.title}</p>
              <p className="text-sm text-gray-500">{ev.date}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(ev)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2"
            >
              <FaEdit /> Modifier
            </button>
            <button
              onClick={() => handleDelete(ev.id)}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
            >
              <FaTrash /> Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
