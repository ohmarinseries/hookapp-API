CREATE TABLE IF NOT EXISTS postimages(
    id SERIAL PRIMARY KEY,
    post_id INTEGER,
    image_url VARCHAR(200),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE postimages
 ADD CONSTRAINT fk_post
 FOREIGN KEY (post_id)
 REFERENCES posts (id);
