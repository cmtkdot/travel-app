-- Create flights table
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    airline TEXT,
    flight_number TEXT,
    departure_date DATE,
    departure_time TIME,
    arrival_date DATE,
    arrival_time TIME,
    departure_airport TEXT,
    arrival_airport TEXT,
    ticket_pdf_url TEXT
);

-- Create hotels table
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    name TEXT,
    address TEXT,
    check_in_date DATE,
    check_out_date DATE,
    reservation_number TEXT,
    notes TEXT,
    booking_pdf_url TEXT
);

-- Create index on trip_id for both tables
CREATE INDEX idx_flights_trip_id ON flights(trip_id);
CREATE INDEX idx_hotels_trip_id ON hotels(trip_id);
