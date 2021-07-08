CREATE TABLE IF NOT EXISTS combcomdislikes(
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL,
    users_id INTEGER NOT NULL
);

ALTER TABLE combcomdislikes
 ADD CONSTRAINT fk_combo
 FOREIGN KEY (comment_id)
 REFERENCES combcomments (id);

 ALTER TABLE combcomdislikes
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);