CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY ,
    username VARCHAR(30) NOT NULL ,
    email VARCHAR(30) NOT NULL,
    pass VARCHAR(200) NOT NULL,
    desctiption TEXT
);