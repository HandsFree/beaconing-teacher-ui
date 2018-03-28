# Config
Configuration files are stored in TOML.

A toml file needs to be created in the following format:

config.toml
```toml
[db]
username = "beaconing_db_user"
password = "123ABCCBA"
name = "beaconing"
table = "activities"
ssl = false

[auth]
id = "teacherui"
secret = "UrqTSjfnaWsaJHCTfGeU6YyEVNa3c2QzE8GrTLcoK1kljsNB3HrG6jXAGI6q8wKR"

[server]
host = ""
```

Place `config.toml` in `backend/cfg/`.

By default the server requests to the API and scripts will be loaded from the external IP address. 

To provide a static URL enter one into the host variable under server without the protocol or trailing slash:

```toml
[server]
host = "teacher.beaconing.eu"
```

Changes to the host configuration will only take place once gin is running in Release Mode.
To change gin to Release mode the variable `GIN_MODE` must be exported with the value `release`:

bash
```
$ export GIN_MODE=release
```

fish
```
$ set -x GIN_MODE release
```

# Database configuration
A schema for the PSQL DB is provided in `backend/`

The user `beaconing_db_user` will be created with the default password of `123ABCCBA`

### Applying the schema
```
$ sudo -u postgres -i
$ createdb beaconing
$ psql beaconing < beaconing.schema.sql
```

# Wiki

Javascript Style Guide: [https://git.juddus.com/HFC/beaconing/wiki/Javascript-Style-Guide](https://git.juddus.com/HFC/beaconing/wiki/Javascript-Style-Guide)

Analytics Info: [https://git.juddus.com/HFC/beaconing/wiki/Javascript-Style-Guide](https://git.juddus.com/HFC/beaconing/wiki/Analytics)

# General Notes
The API layer is the bridge between the backend and the API services provided
from the core beaconing API (and other relevant APIs). This should not handle
sanitisation of data _inputs_. 

The requests are the backend request handlers, these are in charge of taking
in data, sanitising it, and invoking the api layer.
