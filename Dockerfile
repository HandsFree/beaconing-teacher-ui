FROM golang:alpine

RUN apk add --no-cache git

RUN mkdir -p /go/src/beaconing
COPY . /go/src/beaconing

WORKDIR /go/src/beaconing

RUN go-wrapper download
RUN go-wrapper install

CMD ["go-wrapper", "run"]
EXPOSE 8081
