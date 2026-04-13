/*
  # Create rates_cache table

  1. New Tables
    - `rates_cache`
      - `id` (text, primary key) - cache key identifier
      - `data` (jsonb) - cached rates data
      - `fetched_at` (timestamptz) - when the data was fetched from Upstox

  2. Security
    - Enable RLS
    - Allow edge functions (service role) to read/write
    - Allow anonymous users to read (public rates data)
*/

CREATE TABLE IF NOT EXISTS rates_cache (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  fetched_at timestamptz DEFAULT now()
);

ALTER TABLE rates_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rates cache"
  ON rates_cache FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert rates cache"
  ON rates_cache FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update rates cache"
  ON rates_cache FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
