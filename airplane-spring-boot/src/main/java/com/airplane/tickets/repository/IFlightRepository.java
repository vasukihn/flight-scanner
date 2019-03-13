package com.airplane.tickets.repository;

import com.airplane.tickets.model.Flight;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface IFlightRepository extends CrudRepository<Flight, Long> {
    List<Flight> findByOriginAndDestinationAndPriceGreaterThanEqualAndPriceLessThanEqualAndDepartureGreaterThanEqualAndDepartureLessThanEqual(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("minPrice") double minPrice,
            @Param("maxPrice") double maxPrice,
            @Param("departureDateStart") Timestamp departureDateStart,
            @Param("departureDateEnd") Timestamp departureDateEnd
    );
}