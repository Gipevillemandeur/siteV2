'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import type { SettingRow, SettingsMap } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*');
    const rows = (data ?? []) as SettingRow[];
    const nextSettings: SettingsMap = {};

    rows.forEach((row) => {
      if (row.key) nextSettings[row.key] = row.value ?? '';
    });

    setSettings(nextSettings);
  }

  async function handleSave(key: string, value: string) {
    await supabase
      .from('settings')
      .upsert({ key, value });

    alert('Sauvegardé');
  }

  return (
    <div className="p-10 max-w-xl space-y-6">
      
      <Link href="/admin" className="inline-flex items-center gap-2 text-maroon hover:text-gold transition mb-6">
        <FaArrowLeft /> Retour Admin
      </Link>

      <h1 className="text-3xl font-bold">Paramètres du site</h1>

      {['president', 'email', 'rna', 'adresse'].map((key) => (
        <div key={key} className="space-y-2">
          <label className="font-semibold capitalize">{key}</label>
          <input
            value={settings[key] || ''}
            onChange={(e) =>
              setSettings({ ...settings, [key]: e.target.value })
            }
            className="border p-2 w-full"
          />
          <button
            onClick={() => handleSave(key, settings[key])}
            className="bg-maroon text-white px-4 py-1 rounded"
          >
            Enregistrer
          </button>
        </div>
      ))}

    </div>
  );
}
