CREATE TABLE IF NOT EXISTS bargallery(
    id SERIAL PRIMARY KEY,
    bars_id INTEGER,
    image_url VARCHAR(200),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bargallery
 ADD CONSTRAINT fk_bars
 FOREIGN KEY (bars_id)
 REFERENCES bars (id);