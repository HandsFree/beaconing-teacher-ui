-- you cant actually run this yet i havent
-- figured it yet but we have to create a 
-- database called beaconing with the
-- user 'beaconing_db_user' and the password given

CREATE DATABASE beaconing;

CREATE ROLE beaconing_db_user WITH LOGIN PASSWORD 'beAcon1nGDatAbAseACCESS)**';

GRANT ALL PRIVILEGES ON DATABASE beaconing TO beaconing_db_user;

CREATE TABLE activities (
    id serial PRIMARY KEY,
	teacher_id integer NOT NULL,
    creation_date date NOT NULL,
    activity_type integer NOT NULL,
	api_req jsonb NOT NULL
);

GRANT ALL PRIVILEGES ON TABLE activities TO beaconing_db_user;
