"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, List, Map } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Textarea } from "@/components/ui/textarea"

type Trip = {
  id: number
  destination: string
  startDate: string
  endDate: string
  activities: string[]
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [showMap, setShowMap] = useState(false)
  const [newActivity, setNewActivity] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const newTrip: Trip = {
      id: Date.now(),
      destination: formData.get("destination") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      activities: newActivity.split("\n").filter(activity => activity.trim() !== ""),
    }
    setTrips([...trips, newTrip])
    form.reset()
    setNewActivity("")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trip Planner</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" name="destination" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" name="startDate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" name="endDate" type="date" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="activities">Activities (one per line)</Label>
            <Textarea 
              id="activities" 
              name="activities" 
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              placeholder="Enter activities, one per line"
              rows={4}
            />
          </div>
        </div>
        <Button type="submit">Add Trip</Button>
      </form>
      <div className="flex items-center space-x-2">
        <Toggle pressed={!showMap} onPressedChange={() => setShowMap(false)}>
          <List className="h-4 w-4" />
          List View
        </Toggle>
        <Toggle pressed={showMap} onPressedChange={() => setShowMap(true)}>
          <Map className="h-4 w-4" />
          Map View
        </Toggle>
      </div>
      {showMap ? (
        <div className="h-96 bg-muted flex items-center justify-center">
          <p>Map view not implemented in this demo</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Card key={trip.id}>
              <CardHeader>
                <CardTitle>{trip.destination}</CardTitle>
                <CardDescription>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {trip.startDate} - {trip.endDate}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Activities:</h3>
                <ul className="list-disc pl-5">
                  {trip.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
