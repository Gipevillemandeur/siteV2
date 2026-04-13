'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
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
      setTimeout(() => setStatus('idle'), 4000);
    } else {
      setStatus('error');
    }
  };

  const inputClass = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-maroon transition placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-maroon hover:text-gold transition mb-8">
          <FaArrowLeft /> Retour
        </Link>

        <h1 className="text-4xl font-bold text-maroon mb-2">Nous Contacter</h1>
        <div className="w-12 h-1 bg-gold mb-10 rounded"></div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* INFOS */}
          <div className="bg-maroon text-white rounded-3xl p-8 flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Informations</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-gold/20 p-3 rounded-xl">
                    <FaMapMarkerAlt className="text-gold text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gold mb-1">Adresse</p>
                    <p className="text-white/90 text-sm">{settings.adresse || '4 rue Maryse Bastié, 45700 Villemandeur'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gold/20 p-3 rounded-xl">
                    <FaEnvelope className="text-gold text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gold mb-1">Email</p>
                    <a
                      href={`mailto:${settings.email || 'contact@gipevillemandeur.com'}`}
                      className="text-white/90 text-sm hover:text-gold transition"
                    >
                      {settings.email || 'contact@gipevillemandeur.com'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gold mb-4">Retrouvez-nous sur</p>
              <div className="flex gap-4">
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
                  <Image src="/images/logogipefacebook.png" alt="Facebook GIPE" width={48} height={48} className="w-12 h-12 rounded-full" />
                </a>
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
                  <Image src="/images/logogipeinsta.png" alt="Instagram GIPE" width={48} height={48} className="w-12 h-12 rounded-full" />
                </a>
              </div>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-maroon mb-6">Envoyez-nous un message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
                <input
                  name="name"
                  value={formData.name}
                  placeholder="Votre nom"
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  type="email"
                  placeholder="votre@email.fr"
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sujet</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Choisissez un sujet</option>
                  <option>Adhésion</option>
                  <option>Question</option>
                  <option>Événement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  placeholder="Votre message..."
                  onChange={handleChange}
                  className={`${inputClass} h-32 resize-none`}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-maroon text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaPaperPlane />
                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center">
                  ✅ Message envoyé avec succès !
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
                  ⚠️ Une erreur est survenue, veuillez réessayer.
                </div>
              )}

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
