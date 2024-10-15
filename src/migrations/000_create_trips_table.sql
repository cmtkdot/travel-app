-- Create trips table
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    itinerary JSONB
);

-- Create index on destination for faster queries
CREATE INDEX idx_trips_destination ON trips(destination);
