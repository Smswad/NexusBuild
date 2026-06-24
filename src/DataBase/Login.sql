DROP TABLE IF EXISTS Registration CASCADE;

CREATE TABLE Registration(
	Reg_ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	Full_name TEXT NOT NULL,
	Email TEXT NOT NULL UNIQUE,
	Phone_Number TEXT UNIQUE,
	Password TEXT NOT NULL,

	CONSTRAINT chk_client_email    CHECK (Email LIKE '%@%.%'),
	CONSTRAINT chk_client_password CHECK (LENGTH(Password) >= 8),
	CONSTRAINT chk_client_phone    CHECK (Phone_Number ~ '^\+?[0-9\-\s]{7,15}$')
);