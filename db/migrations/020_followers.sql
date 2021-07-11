CREATE TABLE IF NOT EXISTS followers(
    id SERIAL PRIMARY KEY,
    users_id INTEGER NOT NULL,
    follow_id INTEGER NOT NULL
);

ALTER TABLE followers
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);

 ALTER TABLE followers
 ADD CONSTRAINT fk_follower
 FOREIGN KEY (follow_id)
 REFERENCES users (id);