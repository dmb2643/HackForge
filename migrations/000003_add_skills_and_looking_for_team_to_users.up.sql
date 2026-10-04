alter table users
	add column skills text[] NOT NULL DEFAULT ,
	add column looking_for_team bool DEFAULT false;
