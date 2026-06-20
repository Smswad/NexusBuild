DROP TABLE IF EXISTS Client CASCADE;
DROP TABLE IF EXISTS Registration CASCADE;

CREATE TABLE Registration(
	Registration_ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	First_name TEXT NOT NULL,
	Last_name TEXT NOT NULL,
	Client_Email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	
CONSTRAINT chk_reg_email CHECK (Client_Email LIKE '%@%.%'),
CONSTRAINT chk_reg_password CHECK (LENGTH(password) >= 8),
CONSTRAINT fk_client_reg FOREIGN KEY (Client_Email)
                             REFERENCES Client (Email)
                             ON DELETE CASCADE

);

CREATE TABLE Client(
	Email TEXT NOT NULL PRIMARY KEY,
	Password TEXT NOT NULL,

CONSTRAINT chk_client_email    CHECK (Email LIKE '%@%.%'),
CONSTRAINT chk_client_password CHECK (LENGTH(Password) >= 8)
);