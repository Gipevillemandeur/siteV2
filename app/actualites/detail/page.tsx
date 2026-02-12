import { Suspense } from 'react';
import ActualiteDetailClient from './DetailClient';

export default function ActualiteDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-3xl mx-auto px-4 py-12">
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <ActualiteDetailClient />
    </Suspense>
  );
}
