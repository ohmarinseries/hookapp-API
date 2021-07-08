CREATE TABLE IF NOT EXISTS combcomlikes(
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL,
    users_id INTEGER NOT NULL
);

ALTER TABLE combcomlikes
 ADD CONSTRAINT fk_combo
 FOREIGN KEY (comment_id)
 REFERENCES combcomments (id);

 ALTER TABLE combcomlikes
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);