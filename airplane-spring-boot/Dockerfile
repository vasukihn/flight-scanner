FROM maven:3.5-jdk-8 as BUILD

COPY src /usr/src/airplane-spring-boot/src
COPY pom.xml /usr/src/airplane-spring-boot

RUN mvn -f /usr/src/airplane-spring-boot/pom.xml install

FROM openjdk:8

COPY --from=BUILD /usr/src/airplane-spring-boot/target/*.jar  /app.jar
COPY wait-for-it.sh wait-for-it.sh