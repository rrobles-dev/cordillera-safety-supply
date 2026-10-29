CREATE TABLE IF NOT EXISTS posts (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50)  NOT NULL,
  description VARCHAR(250) NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
