# TODO we can use golang:alpine probably since
# we dont depend on postgres anymore.
FROM crowdriff/docker-go-postgres:latest

# Installing packages
RUN apt-get update &&\
    apt-get install -y apt-transport-https &&\
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    curl -sL https://deb.nodesource.com/setup_10.x | bash - &&\
    apt-get install -y yarn &&\
    apt-get install -y nodejs &&\
    apt-get clean &&\
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Make go folder
RUN mkdir -p /go/src/github.com/HandsFree/beaconing-teacher-ui

COPY . /go/src/github.com/HandsFree/beaconing-teacher-ui

RUN mkdir -p /go/src/github.com/HandsFree/teacherui-backend

# quick hack to fix the current arch changes,
# clone the backend into the backend repo
RUN git clone http://github.com/HandsFree/teacherui-backend /data/backend &&\
    cp -r /data/backend/* /go/src/github.com/HandsFree/teacherui-backend/

# Set root dir for commands, we'll be performing
# the commands from the teacherui-backend folder.
WORKDIR /go/src/github.com/HandsFree/teacherui-backend

RUN ls -la /go/src/github.com/HandsFree/teacherui-backend

# Build
# TODO: use non-root user
USER root

# update all go deps, build into beaconing binary.
# cd into the frontend and build.
RUN go get && go build -o beaconing

WORKDIR /go/src/github.com/HandsFree/beaconing-teacher-ui

RUN cd frontend &&\
    rm -rf node_modules &&\
    rm yarn.lock &&\
    yarn &&\
    yarn b

ADD docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT [ "/docker-entrypoint.sh" ]

EXPOSE 8080
