require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('Script started');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

console.log('Supabase environment variables found');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client created');

const vietnamTrip = {
  destination: 'Vietnam',
  start_date: '2024-10-29',
  end_date: '2024-11-14',
  itinerary: [
    { date: '2024-10-29', location: 'Hanoi' },
    { date: '2024-10-30', location: 'Ha Long Bay' },
    { date: '2024-10-31', location: 'Ha Long Bay/Hanoi' },
    { date: '2024-11-01', location: 'Sapa' },
    { date: '2024-11-02', location: 'Sapa' },
    { date: '2024-11-03', location: 'Hanoi to Phu Quoc' },
    { date: '2024-11-04', location: 'Phu Quoc' },
    { date: '2024-11-05', location: 'Phu Quoc' },
    { date: '2024-11-06', location: 'Phu Quoc to Ho Chi Minh City' },
    { date: '2024-11-07', location: 'Ho Chi Minh City' },
    { date: '2024-11-08', location: 'Ho Chi Minh City' },
    { date: '2024-11-09', location: 'Ho Chi Minh City to Phuket' },
    { date: '2024-11-10', location: 'Phuket' },
    { date: '2024-11-11', location: 'Phuket' },
    { date: '2024-11-12', location: 'Phuket to Bangkok' },
    { date: '2024-11-13', location: 'Bangkok' },
    { date: '2024-11-14', location: 'Bangkok/USA' },
  ]
};

async function checkDatabase() {
  console.log('Checking database schema...');
  try {
    const { error } = await supabase
      .from('trips')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      console.error('The trips table does not exist. Please create it manually using the following SQL:');
      console.error(`
        CREATE TABLE trips (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          destination TEXT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          itinerary JSONB
        );
      `);
      return false;
    } else if (error) {
      console.error('Error checking trips table:', error);
      throw error;
    } else {
      console.log('trips table exists.');
      return true;
    }
  } catch (error) {
    console.error('Error checking database:', error);
    throw error;
  }
}

async function addVietnamTrip() {
  console.log('Attempting to insert Vietnam trip:', JSON.stringify(vietnamTrip, null, 2));
  
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert([vietnamTrip])
      .select();

    if (error) {
      console.error('Error inserting Vietnam trip:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('Vietnam trip added successfully:', data);
    }
  } catch (error) {
    console.error('Caught an exception:', error);
  }
}

async function main() {
  try {
    console.log('Starting main function');
    const tableExists = await checkDatabase();
    if (tableExists) {
      await addVietnamTrip();
    } else {
      console.log('Please create the trips table and run the script again.');
    }
    console.log('Main function completed');
  } catch (error) {
    console.error('An error occurred in the main function:', error);
  }
}

main().then(() => {
  console.log('Script execution completed');
}).catch((error) => {
  console.error('Unhandled error in script execution:', error);
});
