import React, { useState, useEffect } from 'react';

interface WeatherComponentProps {
  lat: number;
  lon: number;
}

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

const WeatherComponent: React.FC<WeatherComponentProps> = ({ lat, lon }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
      const response = await fetch(
        https://api.openweathermap.org/data/2.5/weather?lat=&lon=&appid=&units=metric
      );
      const data = await response.json();
      setWeatherData(data);
    };

    fetchWeather();
  }, [lat, lon]);

  if (!weatherData) return <div>Loading weather data...</div>;

  return (
    <div className='bg-white shadow rounded-lg p-4'>
      <h3 className='text-xl font-semibold mb-2'>Current Weather</h3>
      <p>Temperature: {weatherData.main.temp}C</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Conditions: {weatherData.weather[0].description}</p>
      <img
        src={http://openweathermap.org/img/w/.png}
        alt='Weather icon'
      />
    </div>
  );
};

export default WeatherComponent;
