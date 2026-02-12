export const metadata = {
  title: 'Politique de confidentialité | GIPE Villemandeur',
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-gray-700">

        <h1 className="text-4xl font-bold text-maroon">
          Politique de confidentialité
        </h1>

        <p>
          Le site du GIPE Villemandeur respecte la vie privée de ses utilisateurs.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-maroon mb-2">Données collectées</h2>
          <p>
            Aucune donnée personnelle n’est collectée à des fins commerciales.
            Les informations transmises via formulaire de contact servent uniquement
            à répondre aux demandes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-maroon mb-2">Utilisation</h2>
          <p>
            Les données ne sont ni vendues ni transmises à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-maroon mb-2">Cookies</h2>
          <p>
            Le site peut utiliser des cookies techniques nécessaires à son fonctionnement.
            Aucun cookie publicitaire n’est utilisé.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-maroon mb-2">Contact</h2>
          <p>
            contact@gipevillemandeur.com
          </p>
        </section>

      </div>
    </div>
  );
}
