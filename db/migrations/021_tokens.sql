CREATE TABLE IF NOT EXISTS tokens(
    id SERIAL PRIMARY KEY,
    users_id INTEGER NOT NULL,
    token varchar(100) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tokens
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);