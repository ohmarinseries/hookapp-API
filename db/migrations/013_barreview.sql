CREATE TABLE IF NOT EXISTS barreview(
    id SERIAL PRIMARY KEY,
    bars_id INTEGER NOT NULL,
    users_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    score FLOAT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE barreview
 ADD CONSTRAINT fk_bars
 FOREIGN KEY (bars_id)
 REFERENCES bars (id);

 ALTER TABLE barreview
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);