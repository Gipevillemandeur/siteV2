'use client';

import { supabase } from '@/lib/supabase';
import type { SettingRow, SettingsMap } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function MentionsLegalesPage() {
  const [settings, setSettings] = useState<SettingsMap>({});

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*');
      const rows = (data ?? []) as SettingRow[];
      const nextSettings: SettingsMap = {};

      rows.forEach((row) => {
        if (row.key) nextSettings[row.key] = row.value ?? '';
      });

      setSettings(nextSettings);
    }
    fetchSettings();
  }, []);
console.log(settings);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-gray-700">

        <h1 className="text-4xl font-bold text-maroon">
          Mentions légales
        </h1>

        <section>
          <h2 className="text-2xl font-bold text-maroon mb-2">Éditeur du site</h2>
          <p>
            GROUPEMENT INDEPENDANT DE PARENTS D&apos;ÉLÈVES DU COLLÈGE DE VILLEMANDEUR<br/>
            {settings.adresse || '4 rue Maryse Bastié, 45700 Villemandeur'}<br/>
            Email : {settings.email || 'contact@gipevillemandeur.com'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-maroon mb-2">Statut</h2>
          <p>
            Association loi 1901 déclarée en préfecture du Loiret.<br/>
            RNA : {settings.rna || 'W451000794'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-maroon mb-2">
            Responsable de publication
          </h2>
          <p>
            {settings.president || 'Président actuel'} – Président
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-maroon mb-2">Hébergement</h2>
          <p>
            GitHub, Inc.<br/>
            88 Colin P. Kelly Jr. Street<br/>
            San Francisco, CA 94107 – USA
          </p>
        </section>

      </div>
    </div>
  );
}

