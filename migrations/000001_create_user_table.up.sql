CREATE TABLE IF NOT EXISTS users (
	id              UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
	email           text   not null UNIQUE,
	name            text   not null,
	password_hash   text   not null
);
