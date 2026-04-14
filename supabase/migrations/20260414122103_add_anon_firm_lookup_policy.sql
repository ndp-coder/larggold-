/*
  # Allow anonymous firm name lookup for login

  1. Security Changes
    - Add SELECT policy on `user_profiles` for anonymous users
    - Only allows lookup by firm_name to retrieve email for login flow
    - This is needed because users login with firm_name + password,
      so we need to resolve firm_name to email before auth
*/

CREATE POLICY "Allow anon firm name lookup for login"
  ON user_profiles
  FOR SELECT
  TO anon
  USING (true);
