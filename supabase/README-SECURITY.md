# 🔒 Sécurité Supabase - Row Level Security (RLS)

## Situation actuelle

❌ **DANGER** : Vos tables sont actuellement en mode "unrestricted"
- N'importe qui peut lire, modifier ou supprimer vos données
- Risque de vandalisme ou suppression accidentelle

## Solution : Activer RLS

### Étape 1 : Exécuter le SQL

1. Connectez-vous à Supabase Dashboard
2. Allez dans **SQL Editor** : https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
3. Copiez-collez le contenu de `supabase/rls-policies.sql`
4. Cliquez sur **Run** (bouton vert en bas à droite)

### Étape 2 : Vérifier

```sql
-- Dans SQL Editor, vérifiez que RLS est activé :
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('events', 'news', 'documents', 'settings');

-- Résultat attendu : rowsecurity = true pour toutes les tables
```

## Impact sur votre site

### ✅ Ce qui continue de fonctionner :
- **Site public** : affichage des actualités, événements, documents
- **Bandeau d'alerte** : lecture du message d'alerte
- **Make.com** : suppression automatique des événements passés (utilise la clé API)

### ❌ Ce qui ne fonctionnera PLUS :
- **Interface admin** (http://localhost:3000/admin/...)
  - Ajout d'actualités
  - Modification d'événements
  - Upload de documents
  - Modification du bandeau d'alerte

## Solutions pour l'admin

### Option 1 : Dashboard Supabase (recommandé temporairement)

**Avantages :**
- ✅ Gratuit
- ✅ Sécurisé (authentification requise)
- ✅ Fonctionne immédiatement

**Utilisation :**
1. Allez sur https://supabase.com/dashboard/project/YOUR_PROJECT/editor
2. Connectez-vous avec votre compte Supabase
3. Cliquez sur la table (`events`, `news`, `documents`, `settings`)
4. Modifiez directement les lignes

### Option 2 : Implémenter Supabase Auth (recommandé long terme)

**Avantages :**
- ✅ Interface admin personnalisée
- ✅ Très sécurisé
- ✅ Gestion des utilisateurs

**Inconvénients :**
- ❌ Développement nécessaire (~3-4h)
- ❌ Configuration OAuth/email

**Étapes :**
1. Activer Supabase Auth
2. Créer une page `/login` avec authentification
3. Modifier les politiques RLS pour autoriser les utilisateurs authentifiés
4. Protéger les routes `/admin/*` avec vérification de session

### Option 3 : Edge Functions avec secret (compromis)

**Avantages :**
- ✅ Garde l'interface admin actuelle
- ✅ Relativement sécurisé

**Inconvénients :**
- ❌ Nécessite des Edge Functions
- ❌ Secret partagé (moins sécurisé qu'OAuth)

## Recommandation

Pour l'instant, je vous conseille :

1. **Activez RLS immédiatement** (fichier SQL fourni)
2. **Utilisez le dashboard Supabase** pour l'administration quotidienne
3. **Planifiez Supabase Auth** pour plus tard si vous voulez garder l'interface admin

## Questions fréquentes

### Q: Je perds mon interface admin ?
**R:** Temporairement oui, mais vous gagnez en sécurité. Le dashboard Supabase est très simple à utiliser.

### Q: Make.com continuera de supprimer les événements ?
**R:** Oui ! Make.com utilise une clé API qui a tous les droits.

### Q: Puis-je modifier le bandeau d'alerte ?
**R:** Seulement via le dashboard Supabase (table `settings`, clés `alert_enabled`, `alert_message`, `alert_type`).

### Q: C'est urgent d'activer RLS ?
**R:** Oui, surtout si votre site est en production. Sans RLS, quelqu'un pourrait supprimer toutes vos actualités en 30 secondes.

## Ressources

- [Documentation Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Dashboard Supabase](https://supabase.com/dashboard)

---

**Besoin d'aide ?** Contactez-moi pour implémenter Supabase Auth et retrouver votre interface admin sécurisée.
