# Config
Configuration files are stored in TOML.

### General Notes
The API layer is the bridge between the backend and the API services provided
from the core beaconing API (and other relevant APIs). This should not handle
sanitisation of data _inputs_. 

The requests are the backend request handlers, these are in charge of taking
in data, sanitising it, and invoking the api layer.

### PSQL
You need the following database created locally.

```sql
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
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO beaconing_db_user;
```

And this needs to be configured in the TOML config:

```toml
[db]
username = "beaconing_db_user"
password = "beAcon1nGDatAbAseACCESS)**"
name = "beaconing"
table = "activities"
ssl = false
```

Note that SSL is false. This is for local development.

### Authorisation
In the configuration file, make sure to append/edit the `[auth]` section with the 
id and secret as follows:

client.toml
```toml
[auth]
id = "teacherui"
secret = "UrqTSjfnaWsaJHCTfGeU6YyEVNa3c2QzE8GrTLcoK1kljsNB3HrG6jXAGI6q8wKR"
```

### [https://git.juddus.com/HFC/beaconing/issues/9](API Stuff)
API Links:

* [Core API](https://core.beaconing.eu/api-docs/)
* [Auth System Docs](https://www.dropbox.com/s/rtfu6th747et23s/Beaconing%20Auth.docx?dl=0)
* [Statistics API](https://rage.e-ucm.es/api/proxy/gleaner/data/overall/student_id_here_link_follower)

Here is a document on the authentification system:

https://www.dropbox.com/s/rtfu6th747et23s/Beaconing%20Auth.docx?dl=0

It was this https://rage.e-ucm.es/api/proxy/gleaner/data/overall/**student_id**

But it requires auth now, and not sure what the auth process is.