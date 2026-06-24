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

INSERT INTO Registration (Full_name, Email, Phone_Number, Password) VALUES
('Saiful Islam',     'saiful@example.com',   '+8801712345678', 'password123'),
('Tasnim Rahman',    'tasnim@example.com',   '01898765432',    'mysecret99'),
('Arif Hossain',     'arif.hossain@mail.com','+880171234567',  'arifpass2024'),
('Nusrat Jahan',     'nusrat@example.com',    NULL,             'nusratpass1');