#!/bin/sh

# manually copy over some stuff from the backend...
cp ../teacherui-backend/favicon.ico favicon.io
cp ../teacherui-backend/trans.keys trans.keys
cp ../teacherui-backend/trans.map trans.map

./setup_cfg.sh
./../teacherui-backend/beaconing
