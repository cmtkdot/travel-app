-- Create activities table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    title TEXT NOT NULL,
    description TEXT,
    date DATE,
    start_time TIME,
    end_time TIME,
    location TEXT,
    price NUMERIC
);

-- Create budgets table
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    total_budget NUMERIC,
    spent NUMERIC
);

-- Create packing_list table
CREATE TABLE packing_list (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    item TEXT NOT NULL,
    packed BOOLEAN DEFAULT FALSE
);
