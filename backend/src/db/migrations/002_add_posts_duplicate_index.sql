-- Same product + same copy is a duplicate (case-insensitive).
-- Will be extended to include scheduled_at in v1.2.
CREATE UNIQUE INDEX IF NOT EXISTS posts_product_copy_unique_ci
  ON posts (LOWER(name), LOWER(description));
