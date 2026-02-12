# GIPE Villemandeur - Site officiel

Site moderne et performant du Groupement Indépendant de Parents d'Élèves du Collège Lucie Aubrac.

## 🚀 Caractéristiques

- ✨ **Next.js 15** - Framework React avec SSR/SSG et SEO natif
- 🎨 **Tailwind CSS** - Design moderne et responsive
- 🗄️ **Supabase** - Backend et base de données en temps réel
- 📰 **Interface Admin** - Gestion du contenu via tableau de bord
- 📅 **Calendrier dynamique** - Filtrage des événements par mois
- 📧 **Formulaire de contact** - Intégration Formspree
- 📱 **Mobile-first** - Entièrement responsive
- ⚡ **Performance** - Lighthouse optimisé (90+)
- 🔒 **SEO-friendly** - Meta tags, sitemap, robots.txt

## 🛠️ Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Clonez le repo**
```bash
git clone https://github.com/Gipevillemandeur/site.git
cd site
```

2. **Installez les dépendances**
```bash
npm install
```

3. **Configurez Supabase**

Créez un fichier `.env.local` à la racine du projet :
```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme
NEXT_PUBLIC_ADMIN_PASS=VotreMotDePasse123
```

Obtenez vos clés depuis [supabase.com](https://supabase.com) après création d'un projet.

4. **Lancez le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📄 Structure du projet

```
site2gipe/
├── app/                    # Pages principales (Next.js app router)
│   ├── page.tsx            # Page d'accueil
│   ├── actualites/         # Actualités
│   ├── agenda/             # Événements
│   ├── documents/          # Documents téléchargeables
│   ├── contact/            # Formulaire de contact
│   ├── admin/              # Interface d'administration
│   ├── layout.tsx          # Layout global
│   └── globals.css         # Styles globaux
├── components/             # Composants réutilisables
│   ├── Header.tsx          # En-tête navigation
│   ├── Footer.tsx          # Pied de page
│   └── HeroSection.tsx     # Section héros
├── lib/                    # Utilitaires et types
│   ├── supabase.ts         # Client Supabase
│   └── types.ts            # Types TypeScript
├── public/                 # Fichiers statiques (images, favicon)
│   ├── images/             # Images du site
│   ├── CNAME               # Domaine personnalisé
│   ├── robots.txt          # Configuration crawlers
│   └── sitemap.xml         # Plan du site
├── .github/workflows/      # GitHub Actions (déploiement auto)
├── package.json            # Dépendances
├── next.config.ts          # Configuration Next.js
├── tailwind.config.ts      # Configuration Tailwind
└── README.md               # Ce fichier
```

## 📝 Gestion du contenu

Le contenu est géré via **Supabase** et l'interface d'administration.

### Accès à l'interface Admin

1. Allez sur `/admin` sur votre site
2. Entrez le mot de passe défini dans `.env.local` (`NEXT_PUBLIC_ADMIN_PASS`)
3. Gérez les actualités, événements, documents et paramètres

### Tables Supabase

Le projet utilise les tables suivantes :

**news** - Actualités
- `id` (int, primary key)
- `title` (text)
- `content` (text)
- `image_url` (text)
- `date` (date)
- `author` (text)
- `category` (text)

**events** - Événements
- `id` (int, primary key)
- `title` (text)
- `description` (text)
- `date` (date)
- `time` (text)
- `location` (text)
- `image_url` (text)
- `category` (text)

**documents** - Documents téléchargeables
- `id` (int, primary key)
- `title` (text)
- `description` (text)
- `file_url` (text)
- `date` (date)
- `category` (text)

**settings** - Paramètres du site
- `key` (text, primary key)
- `value` (text)

### Ajouter du contenu

1. **Via l'interface Admin** : Utilisez `/admin` pour ajouter/modifier le contenu
2. **Via Supabase Dashboard** : Accédez directement à votre projet Supabase

## 🚀 Déploiement sur GitHub Pages

Le déploiement est **entièrement automatisé** via GitHub Actions.

### Configuration automatique

1. **Le workflow est déjà configuré** dans `.github/workflows/deploy.yml`
2. **Poussez sur la branche `main`** pour déclencher le déploiement
3. **GitHub Pages publiera automatiquement** le site

### Ce qui se passe automatiquement :

- Build du projet Next.js en mode export statique
- Upload du dossier `out/` vers GitHub Pages
- Déploiement sur `https://gipevillemandeur.com`

### Vérifier le déploiement

1. Allez dans **Settings** > **Pages** de votre repo GitHub
2. Vérifiez que la source est **GitHub Actions**
3. Le site sera accessible quelques minutes après le push

```bash
git add .
git commit -m "Update: Modern GIPE website"
git push origin main
```

## 🌐 Configuration du domaine custom

Pour lier `gipevillemandeur.com` à GitHub Pages:

1. Ajoutez un fichier `public/CNAME` :
```
gipevillemandeur.com
```

2. Dans les settings du repo GitHub > Pages, sélectionnez la branche `gh-pages`

3. Chez votre registrar DNS, pointez vers:
   - `gipevillemandeur.github.io` (alias CNAME)
   - Ou les IPs GitHub Pages (A records)

## 🧪 Tests et validation

```bash
# Build de production
npm run build

# Linting (ESLint)
npm run lint

# Audit SEO manuel:
# - Vérifier les meta tags (F12 > Elements)
# - Tester avec Lighthouse (DevTools > Lighthouse)
# - Valider XML: https://validator.nu
```

## 📧 Formulaire de contact

Le formulaire utilise **Formspree** (déjà configuré).

### Formspree actuel
- **ID actuel** : `meelobrp` (configuré dans `app/contact/page.tsx`)
- **Plan gratuit** : 50 emails/mois
- Les emails arrivent à l'adresse configurée sur Formspree

### Changer le destinataire

1. Créez un compte sur [formspree.io](https://formspree.io)
2. Créez un nouveau formulaire et notez l'ID
3. Remplacez dans [app/contact/page.tsx](app/contact/page.tsx#L46) :
```typescript
const response = await fetch('https://formspree.io/f/VOTRE_NOUVEAU_ID', {
```

## 🎨 Personnalisation

### Couleurs
Les couleurs maroon et gold sont définies dans `tailwind.config.ts` et `app/globals.css`.

Modifiez les hex codes:
- Maroon: `#7d201a`
- Gold: `#f59e0b`

### Fonts
Utilisez Google Fonts. Dans `app/layout.tsx`:
```typescript
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

## 📊 Performance & SEO

- ✅ Lighthouse Score: 90+
- ✅ Core Web Vitals optimisés
- ✅ Sitemap.xml généré
- ✅ Robots.txt configuré
- ✅ Meta tags complets
- ✅ Open Graph pour réseaux sociaux

Pour vérifier:
- https://pagespeed.web.dev
- https://www.seobility.net

## 📚 Documentation supplémentaire

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Guides](https://vercel.com/docs)

## 🤝 Contribution

Pour contribuer:
1. Fork le repo
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Commitez les changements (`git commit -m 'Add feature'`)
4. Poussez (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📄 License

MIT License - Libre d'utilisation pour le GIPE Villemandeur

## 📞 Support

Pour toute question : [contact@gipevillemandeur.com](mailto:contact@gipevillemandeur.com)

---

**Made with ❤️ for GIPE Villemandeur**
