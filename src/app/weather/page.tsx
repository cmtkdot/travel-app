"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type WeatherData = {
  date: string
  temp: number
  description: string
}

const mockWeatherData: WeatherData[] = [
  { date: "2023-07-01", temp: 25, description: "Sunny" },
  { date: "2023-07-02", temp: 23, description: "Cloudy" },
  { date: "2023-07-03", temp: 22, description: "Rainy" },
  { date: "2023-07-04", temp: 20, description: "Windy" },
  { date: "2023-07-05", temp: 18, description: "Snowy" },
]

const weatherIcons: { [key: string]: React.ReactNode } = {
  Sunny: <Sun className="h-8 w-8" />,
  Cloudy: <Cloud className="h-8 w-8" />,
  Rainy: <CloudRain className="h-8 w-8" />,
  Windy: <Wind className="h-8 w-8" />,
  Snowy: <CloudSnow className="h-8 w-8" />,
}

export default function WeatherPage() {
  const [location, setLocation] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // In a real app, you would fetch weather data based on the location
    setWeatherData(mockWeatherData)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Weather Forecast</h1>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="flex-grow"
        />
        <Button type="submit">Get Forecast</Button>
      </form>
      {weatherData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast for {location}</CardTitle>
            <CardDescription>5-day forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {weatherData.map((day, index) => (
                <Card key={index} className="flex flex-col items-center p-2">
                  <CardHeader className="p-2 text-center">
                    <CardTitle className="text-sm">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</CardTitle>
                    <CardDescription className="text-xs">{day.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 flex flex-col items-center">
                    {weatherIcons[day.description]}
                    <p className="text-lg font-bold mt-1">{day.temp}C</p>
                    <p className="text-xs">{day.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
