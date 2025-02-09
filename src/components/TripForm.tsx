import React, { useState } from 'react';

interface TripFormProps {
  onSubmit: (trip: { name: string; startDate: string; endDate: string; latitude: number; longitude: number }) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      startDate,
      endDate,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });
    setName('');
    setStartDate('');
    setEndDate('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          Trip Name
        </label>
        <input
          type='text'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>
      <div>
        <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
          Start Date
        </label>
        <input
          type='date'
          id='startDate'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>
      <div>
        <label htmlFor='endDate' className='block text-sm font-medium text-gray-700'>
          End Date
        </label>
        <input
          type='date'
          id='endDate'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>
      <div>
        <label htmlFor='latitude' className='block text-sm font-medium text-gray-700'>
          Latitude
        </label>
        <input
          type='number'
          id='latitude'
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
          step='any'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>
      <div>
        <label htmlFor='longitude' className='block text-sm font-medium text-gray-700'>
          Longitude
        </label>
        <input
          type='number'
          id='longitude'
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
          step='any'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>
      <button
        type='submit'
        className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      >
        Add Trip
      </button>
    </form>
  );
};

export default TripForm;
