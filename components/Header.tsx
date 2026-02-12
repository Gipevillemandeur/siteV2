'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import type { SettingRow } from '@/lib/types';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [alertType, setAlertType] = useState('info');

  useEffect(() => {
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

    fetchAlert();
  }, []);

  return (
    <>
      <header className="bg-[#fffcf5] text-maroon sticky top-0 z-50 shadow-lg">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-gold transition">
            <Image
              src="/images/logogipe.png"
              alt="Logo GIPE"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
            />
            <span>GIPE Villemandeur</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 items-center">
            <li>
              <Link href="/" className="hover:text-gold transition">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/actualites" className="hover:text-gold transition">
                Actualités
              </Link>
            </li>
            <li>
              <Link href="/agenda" className="hover:text-gold transition">
                Agenda
              </Link>
            </li>
            <li>
              <Link href="/documents" className="hover:text-gold transition">
                Documents
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold transition">
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <ul className="md:hidden bg-maroon-900 px-4 py-4 space-y-3 text-white">
            <li>
              <Link href="/" onClick={() => setIsOpen(false)} className="block hover:text-gold transition">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/actualites" onClick={() => setIsOpen(false)} className="block hover:text-gold transition">
                Actualités
              </Link>
            </li>
            <li>
              <Link href="/agenda" onClick={() => setIsOpen(false)} className="block hover:text-gold transition">
                Agenda
              </Link>
            </li>
            <li>
              <Link href="/documents" onClick={() => setIsOpen(false)} className="block hover:text-gold transition">
                Documents
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="block hover:text-gold transition">
                Contact
              </Link>
            </li>
          </ul>
        )}
      </header>

      {alertEnabled && alertMessage.trim() && (
        <div
          className={`sticky top-0 z-40 overflow-hidden ${
            alertType === 'urgent'
              ? 'bg-red-600 text-white'
              : 'bg-gold text-black'
          }`}
        >
          <div className="animate-scroll whitespace-nowrap py-2 text-sm md:text-base font-semibold inline-block">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="inline-block px-8">
                {alertType === 'urgent' ? '⚠️ ' : 'ℹ️ '}
                {alertMessage}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
