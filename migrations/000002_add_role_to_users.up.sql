CREATE TYPE role_type AS ENUM ('frontend', 'backend', 'fullstack', 'designer', 'QA', 'PM');

ALTER TABLE users
ADD COLUMN role role_type NOT NULL DEFAULT 'frontend';
