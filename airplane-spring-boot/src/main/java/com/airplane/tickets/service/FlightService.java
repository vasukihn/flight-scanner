package com.airplane.tickets.service;

import com.airplane.tickets.model.Flight;
import com.airplane.tickets.repository.IFlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class FlightService {
    private final IFlightRepository iFlightRepository;

    @Autowired
    public FlightService(IFlightRepository iFlightRepository) {
        this.iFlightRepository = iFlightRepository;
    }

    public List<Flight> getFlightsByOriginAndDestinationAndMinPriceMaxPriceAndDepartureDate(
            String origin,
            String destination,
            int minPrice,
            int maxPrice,
            Long departureDate,
            Long departureEndDate) {
        Timestamp departureDateStart = new Timestamp(departureDate);
        Timestamp departureDateEnd = new Timestamp(departureEndDate);

        return iFlightRepository.findByOriginAndDestinationAndPriceGreaterThanEqualAndPriceLessThanEqualAndDepartureGreaterThanEqualAndDepartureLessThanEqual(
                origin,
                destination,
                minPrice,
                maxPrice,
                departureDateStart,
                departureDateEnd
        );
    }

    public List<String> getAllOrigins() {
        return StreamSupport.stream(iFlightRepository.findAll().spliterator(), false)
                .map(Flight::getOrigin)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getAllDestinations() {
        return StreamSupport.stream(iFlightRepository.findAll().spliterator(), false)
                .map(Flight::getDestination)
                .distinct()
                .collect(Collectors.toList());
    }
}