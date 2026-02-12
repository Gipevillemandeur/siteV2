'use client';

import { useEffect, useState, useRef, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { generateImageThumbnail } from '@/lib/cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import type { NewsRow } from '@/lib/types';
import LogoutButton from '@/components/LogoutButton';

export default function AdminNewsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSmileys, setShowSmileys] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  useEffect(() => { fetchNews(); }, []);

  async function fetchNews() {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    const rows = (data ?? []) as NewsRow[];
    setNewsList(rows);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    let imageUrl = image;

    // Upload image if file selected
    if (imageFile) {
      // 1. Upload sur Supabase pour le stockage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

      if (uploadError) {
        alert('Erreur upload: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrl = data.publicUrl;

      // 2. Générer miniature Cloudinary pour optimisation
      try {
        const thumbnailUrl = await generateImageThumbnail(imageFile, 'news');
        imageUrl = thumbnailUrl; // Utiliser la miniature Cloudinary plutôt que Supabase
      } catch (cloudinaryError) {
        console.warn('Impossible de générer la miniature avec Cloudinary:', cloudinaryError);
        // Continue avec l'URL Supabase si Cloudinary échoue
      }
    }

    const payload = {
      title,
      content,
      category,
      image_url: imageUrl,
      date: new Date().toISOString(),
    };

    if (editingId) {
      await supabase
        .from('news')
        .update(payload)
        .eq('id', editingId);

      setEditingId(null);
    } else {
      await supabase
        .from('news')
        .insert([payload]);
    }

    setTitle('');
    setContent('');
    setImage('');
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploading(false);
    fetchNews();
  }

  function handleEdit(item: NewsRow) {
    setEditingId(item.id);
    setTitle(item.title ?? '');
    setContent(item.content ?? '');
    setCategory(item.category ?? 'Information');
    setImage(item.image_url ?? '');
  }

  async function handleDelete(id: string | number) {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette actualité ?\n\nCette action est irréversible.')) return;
    
    // Get the news item to find image URL
    const item = newsList.find(n => n.id === id);
    
    // Delete image from storage if it's a Supabase Storage URL
    if (item?.image_url?.includes('supabase')) {
      const fileName = item.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('images').remove([fileName]);
      }
    }
    
    await supabase.from('news').delete().eq('id', id);
    fetchNews();
  }

  function insertEmoji(emoji: string) {
    setContent(content + emoji);
  }

  return (
    <div className="p-10 max-w-3xl space-y-8">

      <div className="flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-maroon hover:text-gold">
          <FaArrowLeft /> Retour Admin
        </Link>
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold text-maroon">Actualités</h1>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        
        {editingId && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-4">
            <p className="font-bold">📝 Mode édition</p>
            <p className="text-sm">Vous modifiez une actualité existante</p>
          </div>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre"
          className="w-full border p-2 rounded"
          required
        />

        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu"
            className="w-full border p-2 rounded"
            rows={6}
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSmileys(!showSmileys)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border transition-colors text-sm font-medium"
            >
              😊 Smileys {showSmileys ? '▼' : '▶'}
            </button>
            <button
              type="button"
              onClick={() => setShowIcons(!showIcons)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border transition-colors text-sm font-medium"
            >
              ⭐ Icônes & Symboles {showIcons ? '▼' : '▶'}
            </button>
          </div>
          
          {showSmileys && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded border">
              {['😊', '😃', '😄', '😁', '😅', '😂', '🤣', '😎', '🥳', '😍', '🤗', '🤔', '😮', '😯', '😲', '😢', '😭', '😡', '😤', '🤩', '😇', '🙂', '🙃', '😉', '😌', '😏', '🤓', '🧐', '😐', '😑', '😶', '🙄'].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="text-xl hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  title={`Insérer ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          
          {showIcons && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded border">
              {['⚠️', '🚨', '⛔', '❌', '✅', '✔️', '📢', '📣', '🔔', '⏰', '🕐', '📅', '📌', '❗', '‼️', '⭐', '💡', '🎉', '🎊', '👉', '👈', '☀️', '🌙', '⚡', '🔥', '💧', '❄️', '🌈', '🎓', '📚', '✏️', '📝', '🏫', '👥', '👨‍👩‍👧‍👦', '🍎', '⚽', '🎯', '🏆'].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="text-xl hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  title={`Insérer ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-maroon">Image ou PDF :</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-blue-600">
            ✨ <strong>Optimisation automatique</strong> via Cloudinary (images et PDFs)
          </p>
          <p className="text-sm text-gray-500">Ou saisir une URL d&apos;image :</p>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="w-full border p-2 rounded"
          />
        </div>

        {/* APERÇU IMAGE */}
        {image && (
          <Image
            src={image}
            alt="Aperçu"
            width={160}
            height={160}
            className="w-40 h-40 object-cover rounded shadow"
            unoptimized
          />
        )}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
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
                setContent('');
                setImage('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                setCategory('Information');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
          )}
        </div>

      </form>

      {/* LISTE */}
      {newsList.map((item) => (
        <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded shadow gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* MINIATURE */}
            {item.image_url ? (
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.image_url}
                  alt={item.title || 'Actualité'}
                  fill
                  className="object-cover rounded"
                  sizes="64px"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 flex-shrink-0 bg-maroon rounded flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2"
            >
              <FaEdit /> Modifier
            </button>

            <button
              onClick={() => handleDelete(item.id)}
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
