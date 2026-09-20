CREATE TABLE IF NOT EXISTS users (
	id           SERIAL  primary key,
	email        text    not null UNIQUE,
	name         text    not null,
	password_hash text    not null
)
