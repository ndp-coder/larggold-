/*
  # Add rate_adjustments table

  ## Summary
  Stores per-firm custom offset values (x1, x2, y1, y2) that are added to
  the four live rates table rows respectively:
    - x1 → SILVER IMP (ALL) 15 KG
    - x2 → SILVER IMP (ALL)
    - y1 → GOLD 999 IMP (ALL)
    - y2 → GOLD 999 IND (ALL)

  Only the owning user (matched by auth.uid via user_profiles) can read/write
  their own adjustments.

  ## New Tables
  - `rate_adjustments`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users, unique — one row per user)
    - `x1` (numeric, default 0) — offset for row 1
    - `x2` (numeric, default 0) — offset for row 2
    - `y1` (numeric, default 0) — offset for row 3
    - `y2` (numeric, default 0) — offset for row 4
    - `updated_at` (timestamptz, default now())

  ## Security
  - RLS enabled
  - Authenticated users can select/insert/update only their own row
*/

CREATE TABLE IF NOT EXISTS rate_adjustments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  x1         numeric NOT NULL DEFAULT 0,
  x2         numeric NOT NULL DEFAULT 0,
  y1         numeric NOT NULL DEFAULT 0,
  y2         numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rate_adjustments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own adjustments"
  ON rate_adjustments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own adjustments"
  ON rate_adjustments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own adjustments"
  ON rate_adjustments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
