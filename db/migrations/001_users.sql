CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY ,
    username VARCHAR(30) NOT NULL ,
    email VARCHAR(30) NOT NULL,
    pass VARCHAR(1000) NOT NULL,
    profile_image VARCHAR(1000),
    description TEXT,
    verification BIT DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);