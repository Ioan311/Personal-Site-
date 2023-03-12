CREATE TYPE roles AS ENUM('admin', 'moderator', 'common');


CREATE TABLE IF NOT EXISTS users (
   id serial PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   first_name VARCHAR(100) NOT NULL,
   last_name VARCHAR(100) NOT NULL,
   passwordd VARCHAR(500) NOT NULL,
   rolee roles NOT NULL DEFAULT 'common',
   email VARCHAR(100) NOT NULL,
   chat_color VARCHAR(50) NOT NULL,
   add_date TIMESTAMP DEFAULT current_timestamp,
   code character varying(200),
   confirmation_email boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS accessing (
   id serial PRIMARY KEY,
   ip VARCHAR(100) NOT NULL,
   user_id INT NULL REFERENCES utilizatori(id),
   page VARCHAR(500) NOT NULL,
   accessing_date TIMESTAMP DEFAULT current_timestamp
);

