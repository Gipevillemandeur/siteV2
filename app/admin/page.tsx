'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    setIsAuthenticated(true);
    setUserEmail(session.user.email || '');
    setIsLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirection en cours
  }

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-maroon">Tableau de bord</h1>
          <p className="text-sm text-gray-600 mt-1">Connecté en tant que : {userEmail}</p>
        </div>
      </div>

      <div className="grid gap-4 max-w-sm">

       <Link href="/admin/news" className="bg-maroon text-white p-4 rounded text-center hover:bg-gold hover:text-maroon transition">
        Actualités
       </Link>

       <Link href="/admin/events" className="bg-maroon text-white p-4 rounded text-center hover:bg-gold hover:text-maroon transition">
        Agenda
       </Link>

       <Link href="/admin/documents" className="bg-maroon text-white p-4 rounded text-center hover:bg-gold hover:text-maroon transition">
        Documents
       </Link>

      <Link href="/admin/alert" className="bg-maroon text-white p-4 rounded text-center hover:bg-gold hover:text-maroon transition">
       Bandeau
      </Link>

      <Link href="/admin/settings" className="bg-maroon text-white p-4 rounded text-center hover:bg-gold hover:text-maroon transition">
       Paramètres
      </Link>

      {/* DECONNEXION */}
       <button onClick={handleLogout} className="bg-red-600 text-white p-2 rounded text-center text-sm hover:bg-red-700 transition font-semibold" >
        🔓 Déconnexion
       </button>

      </div>

    </div>
  );
}
