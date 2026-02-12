-- ============================================
-- RÈGLES RLS POUR SÉCURISER LES DONNÉES
-- ============================================
-- À exécuter dans Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

-- 1. ACTIVER RLS SUR TOUTES LES TABLES
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER LES ANCIENNES POLITIQUES (si existantes)
DROP POLICY IF EXISTS "public_read_events" ON events;
DROP POLICY IF EXISTS "public_read_news" ON news;
DROP POLICY IF EXISTS "public_read_documents" ON documents;
DROP POLICY IF EXISTS "public_read_settings" ON settings;
DROP POLICY IF EXISTS "authenticated_all_events" ON events;
DROP POLICY IF EXISTS "authenticated_all_news" ON news;
DROP POLICY IF EXISTS "authenticated_all_documents" ON documents;
DROP POLICY IF EXISTS "authenticated_all_settings" ON settings;

-- 3. CRÉER DES POLITIQUES DE LECTURE PUBLIQUE (pour le site)
CREATE POLICY "public_read_events"
ON events FOR SELECT
TO public
USING (true);

CREATE POLICY "public_read_news"
ON news FOR SELECT
TO public
USING (true);

CREATE POLICY "public_read_documents"
ON documents FOR SELECT
TO public
USING (true);

CREATE POLICY "public_read_settings"
ON settings FOR SELECT
TO public
USING (true);

-- 4. CRÉER DES POLITIQUES COMPLÈTES POUR UTILISATEURS AUTHENTIFIÉS
-- (Ils peuvent tout faire : SELECT, INSERT, UPDATE, DELETE)

CREATE POLICY "authenticated_all_events"
ON events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_all_news"
ON news FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_all_documents"
ON documents FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_all_settings"
ON settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- RÉSULTAT :
-- ✅ Site public : peut LIRE les données
-- ❌ Site public : NE PEUT PAS modifier/supprimer
-- ✅ Utilisateurs authentifiés : peuvent TOUT faire (admin)
-- ============================================

-- VÉRIFICATION DES POLITIQUES :
-- Exécutez cette commande pour vérifier que tout est OK :
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename IN ('events', 'news', 'documents', 'settings')
ORDER BY tablename, policyname;
