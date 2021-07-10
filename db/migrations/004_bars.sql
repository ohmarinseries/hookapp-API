CREATE TABLE IF NOT EXISTS bars(
    id SERIAL PRIMARY KEY,
    bar_name VARCHAR(50) NOT NULL,
    hookah_id integer,
    city VARCHAR(50) NOT NULL,
    street_address VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    pass VARCHAR(1000) NOT NULL,
    profile_image VARCHAR(1000),
    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bars
 ADD CONSTRAINT fk_hookahcompany
 FOREIGN KEY (hookah_id)
 REFERENCES hookahcompanys (id);
