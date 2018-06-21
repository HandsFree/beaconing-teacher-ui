<p align="center">
  <img width="600" src="http://beaconing.eu/wp-content/themes/beaconing/images/logo/original_version_(black).png" alt="Beaconing">
</p>
<p align="center">
  <strong style="font-size: xx-large">Beaconing Teacher UI</strong>
</p>
<p align="center">
  Teacher Interface for the Beaconing H2020 EU funded project
</p>
<p align="center">
  <a href="http://beaconing.eu/">Website</a> • <a href="https://www.facebook.com/beaconing/">Facebook</a> • <a href="https://twitter.com/BeaconingEU">Twitter</a>
<p align="center">
  <a href="https://semaphoreci.com/juddus/beaconing-teacher-ui">
    <img src="https://semaphoreci.com/api/v1/juddus/beaconing-teacher-ui/branches/nightly/badge.svg" alt="Build Status">
  </a>
</p>

# Repo Information

## Branches
* nightly - contains the latest code, this may be buggy
* master - contains the latest stable release. any time a release is created nightly
should be merged onto the master branch, a release is then made from the master branch.

## License
Licensed under GNU AGPLv3. See the `LICENSE.md` file for the full license.

# Development
## Installation
Cloning the repo should be done using Go:
```
$ go get github.com/HandsFree/beaconing-teacher-ui
```

### Frontend
#### Installing deps
As simple as running yarn.
In the frontend folder run:
```
$ yarn
```
#### Building
Can be build in either production mode (uglified and minified):

```
$ yarn bp
```

or in development mode:

```
$ yarn b
```

### Backend
#### Prerequisites
- PostgreSQL installed locally
- Go

#### Installing
In the backend folder type:
```
$ go build -o beaconing
```

#### Config
A config file must be made before running the backend.

The config file is stored in cfg/config.toml. Below is an example of a configuration file:

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
port = 8080
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

#### Database configuration
A schema for the PSQL DB is provided in the root of the repo.

The user `beaconing_db_user` will be created with the default password of `123ABCCBA`

##### Applying the schema
```
$ sudo -u postgres -i
$ createdb beaconing
$ psql beaconing < beaconing.schema.sql
```

#### Running the backend
In the backend folder:
```
$ ./beaconing
```

The backend will now be running at `localhost:<port>`

# Notes
## Browser plugins blocking functionality
In some cases, the analytics section on the student profile may not work. This is due to a request to `analytics.beaconing.eu` which in some privacy tracker plugins/browser tracking protection implementations will be denied. In my case, the plugin `Privacy Badger` denied access to `analytics.beaconing.eu`.
