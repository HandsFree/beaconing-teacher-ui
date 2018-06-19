# Repository Notes
## Branches

* nightly - contains the latest code, this may be buggy
* master - contains the latest stable release. any time a release is created nightly
should be merged onto the master branch, a release is then made from the master branch.

# Config
Configuration files are stored in TOML.

A toml file needs to be created in the following format:

config.toml
```toml
[db]
username = "beaconing_db_user"
password = "123ABCCBA"
name = "beaconing"
ssl = false

[auth]
id = "teacherui"
secret = "UrqTSjfnaWsaJHCTfGeU6YyEVNa3c2QzE8GrTLcoK1kljsNB3HrG6jXAGI6q8wKR"

[server]
host = ""
port = 8081
root_path = "./../frontend/public/"
glp_files_path = "dist/glp_files/"
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
A schema for the PSQL DB is provided in the root of the repo.

The user `beaconing_db_user` will be created with the default password of `123ABCCBA`

### Applying the schema
```
$ sudo -u postgres -i
$ createdb beaconing
$ psql beaconing < beaconing.schema.sql
```

# Wiki

Javascript Style Guide: [https://git.juddus.com/HFC/beaconing/wiki/Javascript-Style-Guide](https://git.juddus.com/HFC/beaconing/wiki/Javascript-Style-Guide)

Analytics Info: [https://git.juddus.com/HFC/beaconing/wiki/Analytics](https://git.juddus.com/HFC/beaconing/wiki/Analytics)

# General Notes

### Sanitisation
The API layer is the bridge between the backend and the API services provided
from the core beaconing API (and other relevant APIs). This should not handle
sanitisation of data _inputs_. 

The requests are the backend request handlers, these are in charge of taking
in data, sanitising it, and invoking the api layer.

### Browser plugins blocking functionality
In some cases, the analytics section on the student profile may not work. This is due to a request to `analytics.beaconing.eu` which in some privacy tracker plugins/browser tracking protection implementations will be denied. In my case, the plugin `Privacy Badger` denied access to `analytics.beaconing.eu`.
