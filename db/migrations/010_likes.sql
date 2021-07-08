CREATE TABLE IF NOT EXISTS likes(
    id SERIAL PRIMARY KEY,
    post_id INTEGER,
    users_id INTEGER
);

ALTER TABLE likes
 ADD CONSTRAINT fk_post
 FOREIGN KEY (post_id)
 REFERENCES posts (id);
 
ALTER TABLE likes
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);