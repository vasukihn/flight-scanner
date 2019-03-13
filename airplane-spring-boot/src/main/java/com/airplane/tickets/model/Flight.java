package com.airplane.tickets.model;

import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.sql.Timestamp;

@Entity
public class Flight {
    @Id
    @Getter
    @Column(name = "id")
    private String id;

    @Getter
    @Column(name = "departure")
    private Timestamp departure;

    @Getter
    @Column(name = "arrival")
    private Timestamp arrival;

    @Getter
    @Column(name = "origin")
    private String origin;

    @Getter
    @Column(name = "destination")
    private String destination;

    @Getter
    @Column(name = "price")
    private Double price;
}