/*
  # Fix RLS Policy Performance and Security Issues

  1. Changes to `user_profiles`
    - Drop and recreate SELECT, INSERT, UPDATE policies
    - Replace `auth.uid()` with `(select auth.uid())` in all three policies
    - This prevents per-row re-evaluation of auth functions, improving query performance at scale

  2. Changes to `contact_messages`
    - Drop and recreate the INSERT policy
    - Replace `WITH CHECK (true)` with a check that validates required fields are non-empty
    - Prevents unrestricted/blank submissions while still allowing public contact form use

  3. Security
    - All policies remain scoped to correct roles (authenticated / anon+authenticated)
    - No data access changes — only performance and validation improvements
*/

-- Fix user_profiles: drop old policies and recreate with (select auth.uid())
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Fix contact_messages: replace always-true WITH CHECK with meaningful validation
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON contact_messages;

CREATE POLICY "Anyone can submit a contact message"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) > 0 AND
    length(trim(email)) > 0 AND
    length(trim(message)) > 0
  );
