CREATE ROLE beaconing_db_user WITH LOGIN PASSWORD '123ABCCBA';

\connect beaconing

-- the GLPs that have been assigned
-- the gist here is that we store all the glps
-- that have been assigned. we are allowed duplicate
-- plan entries. when we un-assign we remove a single
-- entry.
CREATE TABLE active_plan (
	id serial PRIMARY KEY,

    creation_date date NOT NULL,

	-- the person who assigned it
	teacher_id integer NOT NULL,

	-- the plan id that has been assigned
	plan integer NOT NULL
);

-- for track the activities that have been
-- done by the teacher on the dashboard.
CREATE TABLE activity (
    id serial PRIMARY KEY,
    teacher_id integer NOT NULL,
    creation_date date NOT NULL,
    activity_type integer NOT NULL,
    api_req jsonb NOT NULL
);

-- for cached student avatar binary blobs
CREATE TABLE student_avatar (
    student_id serial PRIMARY KEY,
    avatar_blob bytea NOT NULL
);

GRANT ALL PRIVILEGES ON TABLE activity TO beaconing_db_user;
GRANT ALL PRIVILEGES ON TABLE student_avatar TO beaconing_db_user;
GRANT ALL PRIVILEGES ON TABLE active_plan TO beaconing_db_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO beaconing_db_user;
