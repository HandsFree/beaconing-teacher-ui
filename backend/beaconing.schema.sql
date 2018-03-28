CREATE ROLE beaconing_db_user WITH LOGIN PASSWORD '123ABCCBA';

CREATE DATABASE beaconing IF NOT EXISTS WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE beaconing OWNER TO postgres;

\connect beaconing

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    creation_date date NOT NULL,
    activity_type integer NOT NULL,
    api_req jsonb NOT NULL
);


ALTER TABLE public.activities OWNER TO postgres;


--
-- Name: student_avatars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_avatars (
    student_id integer NOT NULL,
    avatar_blob bytea NOT NULL
);


ALTER TABLE public.student_avatars OWNER TO postgres;

--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: student_avatars student_avatars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_avatars
    ADD CONSTRAINT student_avatars_pkey PRIMARY KEY (student_id);


--
-- Name: TABLE activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.activities TO beaconing_db_user;

--
-- Name: TABLE student_avatars; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_avatars TO beaconing_db_user;

