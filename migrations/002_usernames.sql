ALTER TABLE users ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS directory_visible boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(lower(username)) WHERE username IS NOT NULL;
INSERT INTO migrations(version) VALUES ('002') ON CONFLICT DO NOTHING;
