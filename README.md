<p align="center">
  <img width="600" src="http://beaconing.eu/wp-content/themes/beaconing/images/logo/original_version_(black).png" alt="Beaconing">
</p>
<p align="center">
  <strong>Beaconing Teacher UI</strong>
</p>
<p align="center">
  Teacher Interface for the Beaconing H2020 EU funded project
</p>
<p align="center">
  <a href="http://beaconing.eu/">Website</a> • <a href="https://www.facebook.com/beaconing/">Facebook</a> • <a href="https://twitter.com/BeaconingEU">Twitter</a>
</p>
<p align="center">
  <a href="https://semaphoreci.com/juddus/beaconing-teacher-ui">
    <img src="https://semaphoreci.com/api/v1/juddus/beaconing-teacher-ui/branches/nightly/badge.svg" alt="Build Status">
  </a>
  <a href="https://snyk.io/test/github/HandsFree/beaconing-teacher-ui?targetFile=frontend%2Fpackage.json">
    <img src="https://snyk.io/test/github/HandsFree/beaconing-teacher-ui/badge.svg?targetFile=frontend%2Fpackage.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/HandsFree/beaconing-teacher-ui?targetFile=frontend%2Fpackage.json" style="max-width:100%;">
  </a>
  <a href="https://www.codefactor.io/repository/github/handsfree/beaconing-teacher-ui">
    <img src="https://www.codefactor.io/repository/github/handsfree/beaconing-teacher-ui/badge" alt="CodeFactor">
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
## Prerequisites
- PostgreSQL installed locally
- Go
- Yarn

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
[auth]
id = "teacherui"
secret = "UrqTSjfnaWsaJHCTfGeU6YyEVNa3c2QzE8GrTLcoK1kljsNB3HrG6jXAGI6q8wKR"

[server]
local = true
host = ""
port = 8080
root_path = "./../frontend/public/"
glp_files_path = "./glp_files/"
beaconing_api_route = "https://core.beaconing.eu/api/"

[localisation]
map_file = "./trans.map"
key_file = "./trans.keys"

[debug]
grmon = false
```

Place `config.toml` in `backend/cfg/`.

By default the server requests to the API and scripts will be loaded from the external IP address.

To stop the use of the external IP address, and to make the callback link become 127.0.0.1, you must set `local` to `true`:

```toml
[server]
local = true
```

To provide a static URL enter one into the host variable under server without the trailing slash:

```toml
[server]
host = "example.com"
```

By default, the host will be prefixed with `https://`. If you wish to use `http://` instead, it's possible to add that to the host:
```toml
[server]
host = "http://example.com"
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

#### Running the backend
In the backend folder:
```
$ ./beaconing
```

The backend will now be running at `localhost:<port>`

# Notes
## Browser plugins blocking functionality
In some cases, the analytics section on the student profile may not work. This is due to a request to `analytics.beaconing.eu` which in some privacy tracker plugins/browser tracking protection implementations will be denied. In my case, the plugin `Privacy Badger` denied access to `analytics.beaconing.eu`.