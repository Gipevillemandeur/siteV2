'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
      title="Se déconnecter"
    >
      🔓 Déconnexion
    </button>
  );
}
