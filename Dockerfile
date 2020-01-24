FROM alpine:latest as builder

WORKDIR /app

RUN apk upgrade --update --no-cache && \
    apk add --no-cache \
        openjdk8 \
        maven

ADD . .

RUN mvn clean install

FROM tomcat:9.0.30-jdk8-openjdk

COPY --from=builder /app/target/_-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war
