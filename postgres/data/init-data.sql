DROP TABLE IF EXISTS flight;

CREATE TABLE flight (
  id          SERIAL           NOT NULL PRIMARY KEY,
  departure   TIMESTAMP        NOT NULL,
  arrival     TIMESTAMP        NOT NULL,
  origin      VARCHAR(255)     NOT NULL,
  destination VARCHAR(255)     NOT NULL,
  price       DOUBLE PRECISION NOT NULL
);

CREATE OR REPLACE FUNCTION random_int_between(low INT, high INT)
  RETURNS INT AS
$$
BEGIN
  RETURN floor(random() * (high - low + 1) + low);
END;
$$ LANGUAGE plpgsql STRICT;

CREATE OR REPLACE FUNCTION random_exclusive_city(city_to_exclude VARCHAR)
  RETURNS VARCHAR AS
$func$
DECLARE
  city           VARCHAR [] := '{Amsterdam,Milan,London,Oslo,Vienna,Porto,Venice,Lyon,Edinburgh,Stockholm,Athens}';
  city_to_return VARCHAR;
BEGIN
  city_to_return := city [random_int_between(1, 10)];

  WHILE city_to_return LIKE city_to_exclude LOOP
    city_to_return := city [random_int_between(1, 10)];
  END LOOP;

  RETURN city_to_return;
END
$func$ LANGUAGE plpgsql VOLATILE;

DO $$
DECLARE
  originCity      VARCHAR;
  destinationCity VARCHAR;
BEGIN
  FOR _ IN 1..100000 LOOP
    originCity       := random_exclusive_city('');
    destinationCity  := random_exclusive_city(originCity);

    INSERT INTO flight (
      departure,
      arrival,
      origin,
      destination,
      price
    ) VALUES
      (now() + (random() * (INTERVAL '30 days')),
       now() + '30 days' + (random() * (INTERVAL '30 days')),
       originCity,
       destinationCity,
       random_int_between(1, 100));
  END LOOP;
END; $$;