CREATE TABLE IF NOT EXISTS comments(
    id SERIAL PRIMARY KEY,
    post_id INTEGER,
    users_id INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE comments
 ADD CONSTRAINT fk_post
 FOREIGN KEY (post_id)
 REFERENCES posts (id);
 
ALTER TABLE comments
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);