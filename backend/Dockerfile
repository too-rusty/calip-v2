# #builder image for go binary
# FROM golang:1.15.0-alpine as builder
# RUN mkdir /app
# ADD . /app
# WORKDIR /app
# RUN go clean --modcache
# RUN go mod download
# # RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# #production image used to run the app
# FROM alpine:latest
# # RUN apk --no-cache add ca-certificates
# # RUN apk add --no-cache git make musl-dev go
# COPY --from=builder /app/main .

# #configure go
# ENV GOROOT /usr/lib/go
# ENV GOPATH /go
# ENV PATH /go/bin:$PATH

# RUN  mkdir -p ${GOPATH}/src ${GOPATH}/bin
# EXPOSE 8000
# CMD ["./main"]

# FROM golang:1.15.0
# ADD . /usr/local/go/src/calipv2
# WORKDIR /usr/local/go/src/calipv2
# # RUN go get -v all
# # RUN go get -v all
# RUN go install cmd/main.go
# ENTRYPOINT ["/usr/local/go/bin/main"]

# ENV GO111MODULE=on
# ENV GOPROXY=https://proxy.golang.org,direct

# RUN go install /go/src/calipv2
# ENTRYPOINT /go/bin/calipv2

# EXPOSE 8000




FROM golang:1.15.0
RUN mkdir /app
ADD . /app
WORKDIR /app

# ENV GOROOT /go
ENV GOPATH /go
ENV PATH /go/bin:$PATH
# RUN mkdir -p ${GOROOT}
RUN  mkdir -p ${GOPATH}/src ${GOPATH}/bin

RUN go install cmd/main.go
EXPOSE 8000
ENTRYPOINT ["/go/bin/main"]