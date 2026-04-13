'use client';

import Link from 'next/link';
import { FaArrowLeft, FaHeart, FaUsers, FaCheckCircle } from 'react-icons/fa';

export default function AdhesionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-maroon hover:text-gold transition mb-8">
          <FaArrowLeft /> Retour
        </Link>

        <h1 className="text-4xl font-bold text-maroon mb-4">
          Adhérer au GIPE
        </h1>
        <div className="w-12 h-1 bg-gold mb-8 rounded"></div>

        {/* Pourquoi adhérer */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold text-maroon mb-6 flex items-center gap-2">
            <FaHeart className="text-gold" /> Pourquoi adhérer ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center gap-3">
              <FaUsers className="text-gold text-3xl" />
              <p className="font-semibold text-maroon">Rejoindre une communauté</p>
              <p className="text-gray-600 text-sm">Participez activement à la vie du collège aux côtés des autres parents.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <FaCheckCircle className="text-gold text-3xl" />
              <p className="font-semibold text-maroon">Soutenir nos actions</p>
              <p className="text-gray-600 text-sm">Votre adhésion nous permet d&apos;organiser des événements pour les élèves.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <FaHeart className="text-gold text-3xl" />
              <p className="font-semibold text-maroon">Agir pour vos enfants</p>
              <p className="text-gray-600 text-sm">Ensemble, défendons les intérêts des élèves du collège Lucie Aubrac.</p>
            </div>
          </div>
        </div>

        {/* Widget Hello Asso */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-maroon mb-6">
            Formulaire d&apos;adhésion
          </h2>
          <iframe
            id="haWidget"
            src="https://www.helloasso.com/associations/groupement-independant-de-parents-d-eleves-du-college-de-villemandeur/adhesions/adhesion-au-gipe-du-college/widget"
            style={{ width: '100%', height: '750px', border: 'none' }}
          ></iframe>
        </div>

      </div>
    </div>
  );
}
