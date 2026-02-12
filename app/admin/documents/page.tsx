'use client';

import { useEffect, useState, useRef, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { generatePdfThumbnail } from '@/lib/cloudinary';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import type { DocumentRow } from '@/lib/types';
import LogoutButton from '@/components/LogoutButton';
import Image from 'next/image';

export default function AdminDocumentsPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [category, setCategory] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSmileys, setShowSmileys] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  useEffect(() => { fetchDocs(); }, []);

  async function fetchDocs() {
    const { data } = await supabase.from('documents').select('*');
    const rows = (data ?? []) as DocumentRow[];
    setDocs(rows);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    let finalUrl = fileUrl;
    let thumbnailUrl = '';

    try {
      // Upload file if selected
      if (documentFile) {
        // 1. Upload sur Supabase pour le téléchargement
        const fileExt = documentFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, documentFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        finalUrl = data.publicUrl;

        // 2. Générer miniature automatique avec Cloudinary (PDF ou images)
        try {
          if (documentFile.type === 'application/pdf') {
            thumbnailUrl = await generatePdfThumbnail(documentFile);
          } else if (documentFile.type.startsWith('image/')) {
            // Pour les images, utiliser la fonction image thumbnail
            const { generateImageThumbnail } = await import('@/lib/cloudinary');
            thumbnailUrl = await generateImageThumbnail(documentFile, 'documents');
          }
        } catch (cloudinaryError) {
          console.warn('Impossible de générer la miniature avec Cloudinary:', cloudinaryError);
          // Continue sans miniature si Cloudinary échoue
        }
      }
    } catch (err) {
      alert('Erreur upload: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
      setUploading(false);
      return;
    }

    const payload = { title, description, file_url: finalUrl, thumbnail_url: thumbnailUrl, category };

    if (editingId) {
      await supabase.from('documents').update(payload).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('documents').insert([payload]);
    }

    setTitle('');
    setDescription('');
    setFileUrl('');
    setDocumentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploading(false);
    fetchDocs();
  }

  function handleEdit(doc: DocumentRow) {
    setEditingId(doc.id);
    setTitle(doc.title ?? '');
    setDescription(doc.description ?? '');
    setFileUrl(doc.file_url ?? '');
    setCategory(doc.category ?? 'Formulaire');
  }

  async function handleDelete(id: string | number) {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce document ?\n\nCette action est irréversible.')) return;
    
    const doc = docs.find(d => d.id === id);
    
    // Delete PDF file from Supabase Storage
    if (doc?.file_url?.includes('supabase')) {
      const fileName = doc.file_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('images').remove([fileName]);
      }
    }
    
    // Note: Les miniatures Cloudinary restent sur Cloudinary (pas besoin de les supprimer)
    
    await supabase.from('documents').delete().eq('id', id);
    fetchDocs();
  }

  function insertEmoji(emoji: string) {
    setDescription(description + emoji);
  }

  return(
    <div className="p-10 max-w-3xl space-y-8">

      <div className="flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-maroon hover:text-gold">
          <FaArrowLeft /> Retour Admin
        </Link>
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold text-maroon">Documents</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        
        {editingId && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-4">
            <p className="font-bold">📝 Mode édition</p>
            <p className="text-sm">Vous modifiez un document existant</p>
          </div>
        )}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre"
          className="border p-2 w-full"
          required
        />
        
        <div className="space-y-2">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (facultative)"
            className="border p-2 w-full"
            rows={3}
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
          <label className="block text-sm font-semibold text-maroon">Fichier (PDF, image, doc) :</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-blue-600">
            ✨ <strong>Miniature automatique</strong> générée pour PDFs et images via Cloudinary
          </p>
          <p className="text-sm text-gray-500">Ou saisir une URL de fichier :</p>
          <input
            value={fileUrl}
            onChange={e => setFileUrl(e.target.value)}
            placeholder="https://..."
            className="border p-2 w-full"
          />
          
          {/* APERÇU FICHIER */}
          {documentFile && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <p className="text-sm font-semibold text-maroon">📄 Fichier sélectionné :</p>
              <p className="text-sm text-gray-700">{documentFile.name}</p>
              <p className="text-xs text-gray-500">
                {(documentFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
          
          {fileUrl && !documentFile && (
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-sm font-semibold text-maroon">🔗 URL :</p>
              <p className="text-sm text-gray-700 break-all">{fileUrl}</p>
            </div>
          )}
          
          <p className="text-xs text-blue-600 mt-2">
            ✨ <strong>Miniature automatique :</strong> Pour les PDF, une miniature sera automatiquement générée depuis la première page.
          </p>
        </div>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Sans catégorie</option>
          <option>Règlement</option>
          <option>Compte-Rendu</option>
          <option>Bulletin/Formulaire</option>
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
                setDescription('');
                setFileUrl('');
                setDocumentFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                setCategory('Formulaire');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {docs.map(doc => (
        <div key={doc.id} className="flex items-center justify-between bg-white p-4 rounded shadow gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* MINIATURE */}
            {doc.thumbnail_url ? (
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={doc.thumbnail_url}
                  alt={doc.title || 'Document'}
                  fill
                  className="object-cover rounded"
                  sizes="64px"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 flex-shrink-0 bg-maroon rounded flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div className="flex-1">
              <p className="font-semibold text-maroon">{doc.title}</p>
              {doc.description && (
                <p className="text-sm text-gray-600">{doc.description.substring(0, 60)}...</p>
              )}
              {doc.category && (
                <span className="inline-block bg-gold text-maroon px-2 py-1 rounded text-xs mt-1">
                  {doc.category}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(doc)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2"
            >
              <FaEdit /> Modifier
            </button>
            <button
              onClick={() => handleDelete(doc.id)}
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
