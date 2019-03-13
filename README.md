# Design 

* There are three containers - one with UI app, second witg spring-boot app and third with Postgres db
* These three containers are on the same local network (by docker-compose), so they can see and communicate with each other
* UI sends GET request and then spring boot app recieves and queries the db to fetch flight origin and destinations and when db provides the response - returns it to the client

# Usage

* Run below command on the root Docker file
> $ docker-compose up 

* Visit http://localhost:8080/ or http://host-ip:8080/
  * Incase of WIndows 7 then use http://192.168.99.100:8080/

* To get docker host ip run
> $ docker-machine env

### Note
**Ports 3000, 3001, 8080 and 5432 should be available**
