'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import type { SettingRow } from '@/lib/types';
import LogoutButton from '@/components/LogoutButton';

export default function AdminAlertPage() {
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info'); // 'info' ou 'urgent'
  const [showSmileys, setShowSmileys] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    fetchAlert();
  }, []);

  async function fetchAlert() {
    const { data } = await supabase.from('settings').select('*');
    const rows = (data ?? []) as SettingRow[];
    const map: Record<string, string> = {};

    rows.forEach((row) => {
      if (row.key) map[row.key] = row.value ?? '';
    });

    setAlertEnabled(map.alert_enabled === 'true');
    setAlertMessage(map.alert_message ?? '');
    setAlertType(map.alert_type ?? 'info');
  }

  async function handleSave() {
    await supabase.from('settings').upsert({
      key: 'alert_enabled',
      value: alertEnabled ? 'true' : 'false',
    });

    await supabase.from('settings').upsert({
      key: 'alert_message',
      value: alertMessage,
    });

    await supabase.from('settings').upsert({
      key: 'alert_type',
      value: alertType,
    });

    alert('Bandeau sauvegardé ! Rechargement de la page...');
    
    // Recharger la page pour appliquer les changements
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  function insertEmoji(emoji: string) {
    setAlertMessage(alertMessage + emoji);
  }

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin" className="inline-flex items-center gap-2 text-maroon hover:text-gold transition">
          <FaArrowLeft /> Retour Admin
        </Link>
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold text-maroon mb-6">Bandeau d&apos;alerte</h1>

      <div className="space-y-6">

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={alertEnabled}
          onChange={(e) => setAlertEnabled(e.target.checked)}
          className="h-4 w-4"
        />
        <span className="font-semibold">Afficher le bandeau</span>
      </label>

      <div className="space-y-2">
        <label className="font-semibold">Type de message</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="alertType"
              value="info"
              checked={alertType === 'info'}
              onChange={(e) => setAlertType(e.target.value)}
              className="h-4 w-4"
            />
            <span className="bg-gold text-black px-3 py-1 rounded text-sm">
              ℹ️ Info (Jaune)
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="alertType"
              value="urgent"
              checked={alertType === 'urgent'}
              onChange={(e) => setAlertType(e.target.value)}
              className="h-4 w-4"
            />
            <span className="bg-red-600 text-white px-3 py-1 rounded text-sm">
              ⚠️ Urgent (Rouge)
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Message</label>
        <textarea
          value={alertMessage}
          onChange={(e) => setAlertMessage(e.target.value)}
          className="border p-2 w-full min-h-[140px]"
          placeholder="Votre message d'alerte..."
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

      <button
        onClick={handleSave}
        className="bg-maroon text-white px-4 py-2 rounded"
      >
        Enregistrer le bandeau
      </button>
      </div>
    </div>
  );
}
