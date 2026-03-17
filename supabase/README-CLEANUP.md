# ✅ Nettoyage Automatique des Événements - CONFIGURÉ

Le nettoyage automatique des événements passés est configuré via **Make.com** et s'exécute tous les jours à 0h01 (Europe/Paris).

## 🎯 Solution mise en place : Make.com

### Configuration actuelle

**Service utilisé** : Make.com (gratuit, 1000 opérations/mois)

**Scénario configuré** :
- **URL** : `https://fbimicpeyfgmotkczlqw.supabase.co/rest/v1/events`
- **Méthode** : DELETE
- **Paramètre** : `date=lt.{{formatDate(now; "YYYY-MM-DD")}}`
- **Headers** :
  - `apikey: VOTRE_CLE_PUBLIQUE`
  - `Authorization: Bearer VOTRE_CLE_PUBLIQUE`
  - `Prefer: return=representation`
- **Horaire** : Tous les jours à 0h01 (Europe/Paris)

### Comment ça fonctionne

1. **0h01** → Make.com s'exécute automatiquement
2. **Requête DELETE** → Supprime tous les événements avec `date < aujourd'hui` dans Supabase
3. **Sur le site** → Les événements supprimés n'apparaissent plus automatiquement

---

## 🔧 Modifier la configuration

Pour modifier l'horaire ou les paramètres :
1. Connectez-vous sur [Make.com](https://www.make.com)
2. Allez dans "Scénarios"
3. Sélectionnez le scénario "GIPE - Nettoyage événements"
4. Modifiez l'horaire en cliquant sur "Every day" en bas
5. Sauvegardez

---

## 🧪 Tester manuellement

Dans Make.com :
1. Ouvrez le scénario
2. Cliquez sur "Run once" pour exécuter immédiatement
3. Vérifiez le résultat (Status Code 200 = succès)

---

## ✅ Avantages de Make.com

- ✅ Gratuit (1000 opérations/mois)
- ✅ Interface visuelle simple
- ✅ Pas besoin de déploiement
- ✅ Fonctionne avec le plan gratuit Supabase
- ✅ Calcul automatique de la date du jour
- ✅ Logs et historique des exécutions
- ✅ Notifications en cas d'erreur

---

## 📊 Vérifier que ça fonctionne

1. Créez un événement test avec une date passée dans l'admin
2. Dans Make.com, cliquez sur "Run once"
3. Rafraîchissez la page Agenda du site
4. L'événement passé devrait avoir disparu

---

**Configuration terminée** ✅  
Le nettoyage automatique est opérationnel et fonctionne tous les jours à 0h01.
