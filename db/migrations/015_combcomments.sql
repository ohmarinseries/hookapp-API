CREATE TABLE IF NOT EXISTS combcomments(
    id SERIAL PRIMARY KEY,
    combo_id INTEGER NOT NULL,
    users_id INTEGER NOT NULL,
    comment TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE combcomments
 ADD CONSTRAINT fk_combo
 FOREIGN KEY (combo_id)
 REFERENCES flavourcombs (id);
 
ALTER TABLE flavourcombs
 ADD CONSTRAINT fk_users
 FOREIGN KEY (users_id)
 REFERENCES users (id);


