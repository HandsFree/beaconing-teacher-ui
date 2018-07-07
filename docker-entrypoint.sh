#!/bin/sh

service postgresql start

echo "Waiting for PostgreSQL to be ready"

until runuser -l postgres -c 'pg_isready' 2>/dev/null; do
  sleep 3
done

touch cfg/config.toml
echo "[db]" >> cfg/config.toml
echo "username = \"beaconing_db_user\"" >> cfg/config.toml
echo "password = \"123ABCCBA\"" >> cfg/config.toml
echo "name = \"beaconing\"" >> cfg/config.toml
echo "table = \"activities\"" >> cfg/config.toml
echo "ssl = false" >> cfg/config.toml
echo "[auth]" >> cfg/config.toml
echo "id = \"teacherui\"" >> cfg/config.toml
echo "secret = \"$BCN_SECRET\"" >> cfg/config.toml
echo "[server]" >> cfg/config.toml
echo "host = \"$NOW_URL\"" >> cfg/config.toml
echo "protocol = \"\"" >> cfg/config.toml
echo "port = 8080" >> cfg/config.toml
echo "root_path = \"./files\"" >> cfg/config.toml
echo "glp_files_path = \"glp_files/\"" >> cfg/config.toml

./beaconing
