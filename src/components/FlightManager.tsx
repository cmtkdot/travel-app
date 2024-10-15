"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

export type Flight = {
  id: number
  airline: string
  flightNumber: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  departureAirport: string
  arrivalAirport: string
}

type FlightManagerProps = {
  flights: Flight[]
  onUpdateFlights: (flights: Flight[]) => void
}

export function FlightManager({ flights, onUpdateFlights }: FlightManagerProps) {
  const [newFlight, setNewFlight] = useState<Omit<Flight, 'id'>>({
    airline: '',
    flightNumber: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    departureAirport: '',
    arrivalAirport: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState<number | null>(null)

  function handleAddFlight() {
    setIsLoading(true)
    const flightToAdd = {
      ...newFlight,
      id: Date.now(), // Use a temporary ID
    }
    onUpdateFlights([...flights, flightToAdd])
    setNewFlight({
      airline: '',
      flightNumber: '',
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      departureAirport: '',
      arrivalAirport: '',
    })
    setIsLoading(false)
  }

  function handleUpdateFlight(id: number) {
    setIsLoading(true)
    const updatedFlights = flights.map(f => f.id === id ? { ...f, ...newFlight, id } : f)
    onUpdateFlights(updatedFlights)
    setIsEditing(null)
    setIsLoading(false)
  }

  function handleDeleteFlight(id: number) {
    const updatedFlights = flights.filter(flight => flight.id !== id)
    onUpdateFlights(updatedFlights)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Flight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  value={newFlight.airline}
                  onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="flightNumber">Flight Number</Label>
                <Input
                  id="flightNumber"
                  value={newFlight.flightNumber}
                  onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={newFlight.departureDate}
                  onChange={(e) => setNewFlight({ ...newFlight, departureDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  type="time"
                  value={newFlight.departureTime}
                  onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="arrivalDate">Arrival Date</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={newFlight.arrivalDate}
                  onChange={(e) => setNewFlight({ ...newFlight, arrivalDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={newFlight.arrivalTime}
                  onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departureAirport">Departure Airport</Label>
                <Input
                  id="departureAirport"
                  value={newFlight.departureAirport}
                  onChange={(e) => setNewFlight({ ...newFlight, departureAirport: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="arrivalAirport">Arrival Airport</Label>
                <Input
                  id="arrivalAirport"
                  value={newFlight.arrivalAirport}
                  onChange={(e) => setNewFlight({ ...newFlight, arrivalAirport: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button onClick={handleAddFlight} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Adding..." : "Add Flight"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flights.map((flight) => (
          <Card key={flight.id} className="relative">
            <CardHeader>
              <CardTitle>{flight.airline} - {flight.flightNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing === flight.id ? (
                <div className="space-y-2">
                  <Input
                    value={flight.airline}
                    onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                    placeholder="Airline"
                  />
                  <Input
                    value={flight.flightNumber}
                    onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })}
                    placeholder="Flight Number"
                  />
                  <Input
                    type="date"
                    value={flight.departureDate}
                    onChange={(e) => setNewFlight({ ...newFlight, departureDate: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={flight.departureTime}
                    onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
                  />
                  <Input
                    value={flight.departureAirport}
                    onChange={(e) => setNewFlight({ ...newFlight, departureAirport: e.target.value })}
                    placeholder="Departure Airport"
                  />
                  <Input
                    type="date"
                    value={flight.arrivalDate}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalDate: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={flight.arrivalTime}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
                  />
                  <Input
                    value={flight.arrivalAirport}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalAirport: e.target.value })}
                    placeholder="Arrival Airport"
                  />
                  <Button onClick={() => handleUpdateFlight(flight.id)} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Update
                  </Button>
                </div>
              ) : (
                <>
                  <p><strong>Departure:</strong> {flight.departureAirport} on {format(new Date(`${flight.departureDate}T${flight.departureTime}`), 'PPpp')}</p>
                  <p><strong>Arrival:</strong> {flight.arrivalAirport} on {format(new Date(`${flight.arrivalDate}T${flight.arrivalTime}`), 'PPpp')}</p>
                </>
              )}
            </CardContent>
            <div className="absolute top-2 right-2 space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(isEditing === flight.id ? null : flight.id)}
              >
                {isEditing === flight.id ? 'Cancel' : 'Edit'}
              </Button>
              <Button 
                size="sm"
                variant="destructive" 
                onClick={() => handleDeleteFlight(flight.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
