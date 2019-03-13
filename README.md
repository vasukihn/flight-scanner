# Design 

* There are three containers - one with UI app, second witg spring-boot app and third with Postgres db
* These three containers are on the same local network (by docker-compose), so they can see and communicate with each other
* UI sends GET request to fecth "origins" and "destinations" from the db via spring boot once user visits "/" path and then any changes in the filters (date/price) will fetch the filered flight result to the user to choose for booking. 
* Spring boot app recieves all these requests from UI and queries the db to fetch flight origin, destinations and filtered flights and when db provides the response - returns it to the client

# Usage

* Tested and works on Chrome browser

* Run below command on the root Docker file
> $ docker-compose up 

* If you are running MacOS/Linux/Windows 10 then visit http://localhost:3000/ or http://host-ip:3000/
  * Incase of WIndows 7 OS then use http://192.168.99.100:3000/

* To get docker host ip run
> $ docker-machine env

### Note
**Ports 3000, 3001 and 5432 should be available**
