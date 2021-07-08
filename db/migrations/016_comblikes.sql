CREATE TABLE IF NOT EXISTS comblikes(
    id SERIAL PRIMARY KEY,
    combo_id INTEGER NOT NULL,
    users_id INTEGER NOT NULL
);

ALTER TABLE comblikes
 ADD CONSTRAINT fk_combo
 FOREIGN KEY (combo_id)
 REFERENCES flavourcombs (id);

 ALTER TABLE comblikes
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);