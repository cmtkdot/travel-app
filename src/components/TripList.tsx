import React from 'react';

interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
}

interface TripListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onSelectTrip }) => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Your Trips</h2>
      {trips.length === 0 ? (
        <p>No trips planned yet. Add a new trip to get started!</p>
      ) : (
        <ul className='space-y-4'>
          {trips.map((trip) => (
            <li 
              key={trip.id} 
              className='bg-white shadow rounded-lg p-4 cursor-pointer hover:bg-gray-50'
              onClick={() => onSelectTrip(trip)}
            >
              <h3 className='text-xl font-semibold'>{trip.name}</h3>
              <p className='text-gray-600'>
                {trip.startDate} - {trip.endDate}
              </p>
              <p className='text-gray-500'>
                Lat: {trip.latitude.toFixed(4)}, Lon: {trip.longitude.toFixed(4)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TripList;
