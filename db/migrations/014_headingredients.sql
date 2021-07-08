CREATE TABLE IF NOT EXISTS headingredients(
    id SERIAL PRIMARY KEY,
    combo_id INTEGER NOT NULL,
    flavour_id INTEGER NOT NULL,
    percentage INTEGER NOT NULL
);

ALTER TABLE headingredients
 ADD CONSTRAINT fk_combo
 FOREIGN KEY (combo_id)
 REFERENCES flavourcombs (id);

ALTER TABLE headingredients
 ADD CONSTRAINT fk_flavour
 FOREIGN KEY (flavour_id)
 REFERENCES flavourcatalog (id);
