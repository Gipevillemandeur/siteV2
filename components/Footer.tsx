'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import type { SettingRow, SettingsMap } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
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

  return (
    <footer className="relative bg-gradient-to-b from-[#fffcf5] to-maroon py-8 mt-10">

      {/* Overlay */}
      <div className="absolute inset-0 bg-maroon/30"></div>

      {/* Contenu */}
      <div className="relative max-w-6xl mx-auto px-4 text-white">

        <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-left">

          {/* About */}
          <div>
            <h3 className="font-bold text-xl mb-3">GIPE Villemandeur</h3>
            <p className="text-white text-sm leading-relaxed">
              <span className="block">
                Groupement Indépendant de Parents d&apos;Élèves du Collège Lucie Aubrac.
              </span>
              <span className="block mt-1">
                Agir ensemble pour nos enfants.
              </span>
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-xl mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-white hover:text-gold transition">Accueil</Link></li>
              <li><Link href="/actualites" className="text-white hover:text-gold transition">Actualités</Link></li>
              <li><Link href="/agenda" className="text-white hover:text-gold transition">Agenda</Link></li>
              <li><Link href="/documents" className="text-white hover:text-gold transition">Documents</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xl mb-3">Nous contacter</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <FaMapMarkerAlt className="text-gold" />
                <span>
                  {settings.adresse || '4 rue Maryse Bastié, 45700 Villemandeur'}
                </span>
              </li>

              <li className="flex items-center gap-2 justify-center md:justify-start">
                <FaEnvelope className="text-gold" />
                <a
                  href={`mailto:${settings.email || 'contact@gipevillemandeur.com'}`}
                  className="text-white hover:text-gold transition"
                >
                  {settings.email || 'contact@gipevillemandeur.com'}
                </a>
              </li>

              <li className="flex gap-4 mt-4 justify-center md:justify-start">
                <a href="https://facebook.com/gipevillemandeur.45" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition">
                  <FaFacebook size={24} />
                </a>
                <a href="https://instagram.com/gipe_lucie_aubrac" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition">
                  <FaInstagram size={24} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bas Footer */}
        <div className="border-t border-white/20 pt-4 text-center text-sm space-y-2">
          <p>&copy; {currentYear} GIPE Villemandeur - Tous droits réservés</p>

          <div className="flex justify-center gap-4 text-xs">
            <Link href="/mentions-legales" className="hover:text-gold transition">
              Mentions légales
            </Link>
            <span>|</span>
            <Link href="/confidentialite" className="hover:text-gold transition">
              Politique de confidentialité
            </Link>
            <Link href="/admin" className="block text-[10px] opacity-30 hover:opacity-100 transition mt-2">
              Admin
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
