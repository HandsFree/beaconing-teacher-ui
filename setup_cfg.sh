#!/bin/sh

mkdir -p cfg
touch cfg/config.toml
echo "[auth]" >> cfg/config.toml
echo "id = \"teacherui\"" >> cfg/config.toml
echo "secret = \"$BCN_SECRET\"" >> cfg/config.toml

echo "[server]" >> cfg/config.toml
echo "local = false" >> cfg/config.toml
echo "host = \"$NOW_URL\"" >> cfg/config.toml
echo "protocol = \"\"" >> cfg/config.toml
echo "port = 8080" >> cfg/config.toml
echo "root_path = \"./files\"" >> cfg/config.toml
echo "glp_files_path = \"glp_files/\"" >> cfg/config.toml
echo "beaconing_api_route = \"https://core.beaconing.eu/api/\"" >> cfg/config.toml
echo "templates = [ \"/go/src/github.com/HandsFree/teacherui-backend/templates/index.html\", \"/go/src/github.com/HandsFree/teacherui-backend/templates/unauthorised_user.html\" ]" >> cfg/config.toml
echo "dist_folder = \"/go/src/github.com/HandsFree/beaconing-teacher-ui/frontend/public/dist\"" >> cfg/config.toml

echo "[localisation]" >> cfg/config.toml
echo "map_file = \"./trans.map\"" >> cfg/config.toml
echo "key_file = \"./trans.keys\"" >> cfg/config.toml

echo "[debug]" >> cfg/config.toml
echo "grmon = false" >> cfg/config.toml

