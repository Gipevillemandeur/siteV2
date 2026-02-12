# 🔐 Configuration de l'Authentification Admin

## ✅ Ce qui a été mis en place

Votre site GIPE dispose maintenant d'un système d'authentification sécurisé avec **Supabase Auth** :

- ✅ Page de connexion `/admin/login`
- ✅ Protection automatique de toutes les pages admin
- ✅ Boutons de déconnexion dans toutes les pages
- ✅ RLS activé pour protéger les données
- ✅ Interface admin entièrement fonctionnelle

## 🚀 Configuration initiale (À FAIRE UNE SEULE FOIS)

### Étape 1 : Activer Row Level Security (RLS)

1. Connectez-vous à **Supabase Dashboard**
   - URL : https://supabase.com/dashboard
   
2. Sélectionnez votre projet

3. Allez dans **SQL Editor** (icône </>)
   - URL directe : https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new

4. Copiez-collez tout le contenu du fichier `supabase/rls-policies.sql`

5. Cliquez sur **Run** (bouton vert en bas à droite)

6. Vérifiez que tout est OK (doit afficher "Success")

### Étape 2 : Créer votre compte administrateur

1. Dans Supabase Dashboard, allez dans **Authentication** → **Users**
   - URL : https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/users

2. Cliquez sur **"Add user"** → **"Create new user"**

3. Remplissez le formulaire :
   ```
   Email: votre-email@gipe-villemandeur.fr
   Password: [Choisissez un mot de passe sécurisé]
   
   Exemple de mot de passe fort :
   Gipe2026!Secure#Admin
   
   Auto Confirm User: ✅ COCHEZ CETTE CASE
   (Important pour ne pas avoir à confirmer par email)
   ```

4. Cliquez sur **"Create user"**

5. Votre compte admin est créé ! 🎉

### Étape 3 : Tester la connexion

1. Allez sur votre site : `http://localhost:3000/admin`

2. Vous serez redirigé vers `/admin/login`

3. Entrez l'email et le mot de passe que vous venez de créer

4. Cliquez sur **"Se connecter"**

5. ✅ Vous devriez être connecté et voir le tableau de bord admin !

## 📱 Utilisation quotidienne

### Se connecter

1. Allez sur `http://localhost:3000/admin`
2. Entrez votre email + mot de passe
3. La session reste active (pas besoin de se reconnecter à chaque fois)

### Se déconnecter

Cliquez sur le bouton **"🔓 Déconnexion"** en haut à droite de n'importe quelle page admin.

### Gérer le contenu

Une fois connecté, vous avez accès à toutes vos fonctionnalités habituelles :

- ✅ **Actualités** : Ajouter, modifier, supprimer
- ✅ **Agenda** : Gérer les événements
- ✅ **Documents** : Uploader des PDFs/images
- ✅ **Bandeau** : Modifier le message d'alerte
- ✅ **Emojis & Icônes** : Toujours disponibles

## 🔒 Sécurité

### Ce qui est protégé

| Action | Public | Authentifié |
|--------|--------|-------------|
| Voir actualités | ✅ | ✅ |
| Voir événements | ✅ | ✅ |
| Voir documents | ✅ | ✅ |
| Ajouter/Modifier | ❌ | ✅ |
| Supprimer | ❌ | ✅ |

### Avantages

- ✅ Le site reste public (visiteurs peuvent voir le contenu)
- ✅ Seuls les utilisateurs authentifiés peuvent modifier
- ✅ Les données sont protégées contre les modifications non autorisées
- ✅ Pas de risque de vandalisme ou suppression accidentelle

## 👥 Gestion des utilisateurs

### Ajouter un administrateur supplémentaire

1. Supabase Dashboard → Authentication → Users
2. "Add user" → "Create new user"
3. Entrez l'email + mot de passe
4. ✅ Cochez "Auto Confirm User"
5. La personne pourra se connecter immédiatement

### Supprimer un administrateur

1. Supabase Dashboard → Authentication → Users
2. Cliquez sur l'utilisateur
3. "Delete user"

### Réinitialiser un mot de passe

**Option 1 : Via Dashboard**
1. Authentication → Users
2. Cliquez sur l'utilisateur
3. Cliquez sur "Reset password"
4. Définissez un nouveau mot de passe

**Option 2 : Via Email (si configuré)**
1. Page de login → "Mot de passe oublié ?"
2. Email de réinitialisation envoyé

## ⚠️ Problèmes courants

### "Email ou mot de passe incorrect"

- ✅ Vérifiez que vous avez bien créé l'utilisateur dans Supabase
- ✅ Vérifiez que "Auto Confirm User" était coché
- ✅ Vérifiez que le mot de passe est correct (sensible à la casse)

### "Page blanche après connexion"

- ✅ Vérifiez que RLS est activé avec les bonnes politiques
- ✅ Ouvrez la console navigateur (F12) pour voir les erreurs
- ✅ Vérifiez que les politiques `authenticated_all_*` existent

### "Impossible de modifier les actualités"

- ✅ Vérifiez que vous êtes bien connecté (bouton déconnexion visible)
- ✅ Vérifiez que les politiques RLS pour `authenticated` sont actives
- ✅ Rechargez la page (F5)

### "Redirigé vers /admin/login en boucle"

- ✅ Videz le cache du navigateur (Ctrl+Shift+Delete)
- ✅ Essayez en navigation privée
- ✅ Vérifiez que Supabase Auth est bien configuré

## 🔧 Configuration Make.com

**Important :** Make.com utilise la clé API et continuera de fonctionner pour la suppression automatique des événements passés, même avec RLS activé.

Aucune modification nécessaire ! ✅

## 📊 Vérification que tout fonctionne

### Checklist de test

- [ ] Je peux me connecter sur `/admin/login`
- [ ] Je suis redirigé vers `/admin` après connexion
- [ ] Je vois mon email en haut du tableau de bord
- [ ] Je peux ajouter une actualité
- [ ] Je peux modifier un événement
- [ ] Je peux uploader un document
- [ ] Je peux changer le bandeau d'alerte
- [ ] Le bouton "Déconnexion" fonctionne
- [ ] Après déconnexion, je ne peux plus accéder à `/admin/news`
- [ ] Le site public (`http://localhost:3000`) affiche bien les actualités

## 🚀 Déploiement en production

Quand vous déployez sur GitHub Pages :

1. **Les variables d'environnement Supabase** sont déjà configurées dans `.env.local`
2. **Le build Next.js** inclut déjà la configuration Auth
3. **RLS est actif** sur Supabase (indépendant du déploiement)
4. **L'admin fonctionnera** sur `https://votre-site.fr/admin`

Rien de spécial à faire ! 🎉

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Gestion des utilisateurs](https://supabase.com/docs/guides/auth/managing-user-data)

## 🆘 Support

Si vous rencontrez un problème :

1. Vérifiez cette documentation
2. Consultez la console navigateur (F12 → Console)
3. Vérifiez les logs Supabase Dashboard
4. Contactez le support

---

**Félicitations ! Votre site est maintenant sécurisé.** 🎉🔒
