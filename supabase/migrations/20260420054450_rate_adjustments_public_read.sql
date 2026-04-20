/*
  # Allow public read on rate_adjustments

  Rate adjustment values (x1, x2, y1, y2) are display offsets shown to all
  visitors. They are not sensitive — anyone viewing the site should see the
  same adjusted rates. This policy allows anon/unauthenticated users to read
  the adjustments row so the live rates table reflects the latest values for
  all users.
*/

CREATE POLICY "Anyone can read rate adjustments"
  ON rate_adjustments
  FOR SELECT
  TO anon
  USING (true);
