CREATE TABLE IF NOT EXISTS posts(
    id SERIAL PRIMARY KEY,
    users_id INTEGER,
    bars_id INTEGER,
    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE posts
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);

ALTER TABLE posts
 ADD CONSTRAINT fk_bars
 FOREIGN KEY (bars_id)
 REFERENCES bars (id);