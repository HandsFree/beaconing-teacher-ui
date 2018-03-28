CREATE ROLE beaconing_db_user WITH LOGIN PASSWORD '123ABCCBA';

\connect beaconing

CREATE TABLE activities (
    id serial PRIMARY KEY,
    teacher_id integer NOT NULL,
    creation_date date NOT NULL,
    activity_type integer NOT NULL,
    api_req jsonb NOT NULL
);

CREATE TABLE student_avatars (
    student_id serial PRIMARY KEY,
    avatar_blob bytea NOT NULL
);

GRANT ALL PRIVILEGES ON TABLE activities TO beaconing_db_user;
GRANT ALL PRIVILEGES ON TABLE student_avatars TO beaconing_db_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO beaconing_db_user;
