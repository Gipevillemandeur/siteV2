'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import type { SettingRow, SettingsMap } from '@/lib/types';

export default function ContactPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const response = await fetch('https://formspree.io/f/meelobrp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-maroon hover:text-gold mb-8">
          <FaArrowLeft /> Retour
        </Link>

        <h1 className="text-4xl font-bold text-maroon mb-12">Nous Contacter</h1>

        <div className="grid md:grid-cols-2 gap-12">

          {/* INFOS */}
          <div>
            <h2 className="text-2xl font-bold text-maroon mb-6">Informations</h2>

            <div className="space-y-6">

              <div className="flex gap-4">
                <FaMapMarkerAlt className="text-gold text-2xl mt-1" />
                <p>{settings.adresse}</p>
              </div>

              <div className="flex gap-4">
                <FaEnvelope className="text-gold text-2xl mt-1" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold">
                  {settings.email}
                </a>
              </div>

              <div className="flex gap-6 mt-6">
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/logogipefacebook.png"
                    alt="Facebook GIPE"
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                </a>
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/logogipeinsta.png"
                    alt="Instagram GIPE"
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                </a>
              </div>

            </div>
          </div>

          {/* FORMULAIRE */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">

              <input name="name" placeholder="Nom" onChange={handleChange} className="w-full border p-2" required />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-2" required />

              <select name="subject" onChange={handleChange} className="w-full border p-2" required>
                <option value="">Sujet</option>
                <option>Adhésion</option>
                <option>Question</option>
                <option>Événement</option>
              </select>

              <textarea name="message" placeholder="Message" onChange={handleChange} className="w-full border p-2" required />

              <button className="bg-maroon text-white px-4 py-2 rounded w-full">
                Envoyer
              </button>

              {status === 'success' && <p className="text-green-600">Message envoyé !</p>}
              {status === 'error' && <p className="text-red-600">Erreur d’envoi</p>}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
