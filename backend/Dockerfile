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
