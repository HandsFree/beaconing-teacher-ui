FROM golang:alpine

RUN set -ex; \
	postgresHome="$(getent passwd postgres)"; \
	postgresHome="$(echo "$postgresHome" | cut -d: -f6)"; \
	[ "$postgresHome" = '/var/lib/postgresql' ]; \
	mkdir -p "$postgresHome"; \
	chown -R postgres:postgres "$postgresHome"

RUN apk --update add \
    bash nano curl git \
    postgresql postgresql-contrib postgresql-dev

RUN rm -rf /var/cache/apk/*

RUN curl -o /usr/local/bin/gosu -sSL "https://github.com/tianon/gosu/releases/download/1.9/gosu-amd64"
RUN chmod +x /usr/local/bin/gosu

ENV LANG en_US.utf8
ENV PGDATA /var/lib/postgresql/data

RUN mkdir -p /var/run/postgresql && chown -R postgres:postgres /var/run/postgresql && chmod 2777 /var/run/postgresql
RUN mkdir -p /run/postgresql && chown -R postgres:postgres /run/postgresql && chmod 2777 /run/postgresql
RUN mkdir -p "$PGDATA" && chown -R postgres:postgres "$PGDATA" && chmod 777 "$PGDATA"

VOLUME /var/lib/postgresql/data

RUN mkdir /docker-entrypoint-initdb.d
COPY backend/beaconing.schema.sql /docker-entrypoint-initdb.d

COPY docker_entrypoint.sh .
USER postgres
RUN /bin/bash docker_entrypoint.sh

RUN mkdir -p /go/src/beaconing
COPY . /go/src/beaconing

WORKDIR /go/src/beaconing/backend

RUN go-wrapper download
RUN go-wrapper install

CMD ["go-wrapper", "run"]
EXPOSE 8081
