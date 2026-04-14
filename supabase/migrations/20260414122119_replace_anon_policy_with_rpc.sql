/*
  # Replace broad anon policy with secure RPC function

  1. Security Changes
    - Drop the overly broad anon SELECT policy
    - Create a secure RPC function that only returns email for a given firm_name
    - This limits anon access to only what's needed for login
*/

DROP POLICY IF EXISTS "Allow anon firm name lookup for login" ON user_profiles;

CREATE OR REPLACE FUNCTION lookup_email_by_firm(p_firm_name text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM user_profiles WHERE firm_name = p_firm_name LIMIT 1;
$$;
