CREATE TABLE IF NOT EXISTS flavourcombs(
    id SERIAL PRIMARY KEY,
    users_id INTEGER NOT NULL,
    base_ingredients TEXT NOT NULL,
    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE flavourcombs
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);