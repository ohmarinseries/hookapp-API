CREATE TABLE IF NOT EXISTS flavourcatalog(
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    flavourtype VARCHAR(20),
    profile_image VARCHAR(1000)
);

ALTER TABLE flavourcatalog
 ADD CONSTRAINT fk_flavourcompanys
 FOREIGN KEY (company_id)
 REFERENCES flavourcompanys (id);
