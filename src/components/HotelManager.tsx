"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

export type Hotel = {
  id: number
  name: string
  address: string
  checkInDate: string
  checkOutDate: string
  reservationNumber: string
  notes: string
}

type HotelManagerProps = {
  hotels: Hotel[]
  onUpdateHotels: (hotels: Hotel[]) => void
}

export function HotelManager({ hotels, onUpdateHotels }: HotelManagerProps) {
  const [newHotel, setNewHotel] = useState<Omit<Hotel, 'id'>>({
    name: '',
    address: '',
    checkInDate: '',
    checkOutDate: '',
    reservationNumber: '',
    notes: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState<number | null>(null)

  function handleAddHotel() {
    setIsLoading(true)
    const hotelToAdd = {
      ...newHotel,
      id: Date.now(), // Use a temporary ID
    }
    onUpdateHotels([...hotels, hotelToAdd])
    setNewHotel({
      name: '',
      address: '',
      checkInDate: '',
      checkOutDate: '',
      reservationNumber: '',
      notes: '',
    })
    setIsLoading(false)
  }

  function handleUpdateHotel(id: number) {
    setIsLoading(true)
    const updatedHotels = hotels.map(h => h.id === id ? { ...h, ...newHotel, id } : h)
    onUpdateHotels(updatedHotels)
    setIsEditing(null)
    setIsLoading(false)
  }

  function handleDeleteHotel(id: number) {
    const updatedHotels = hotels.filter(hotel => hotel.id !== id)
    onUpdateHotels(updatedHotels)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Hotel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>-+
              <Label htmlFor="name">Hotel Name</Label>
              <Input
                id="name"
                value={newHotel.name}
                onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newHotel.address}
                onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkInDate">Check-in Date</Label>
                <Input
                  id="checkInDate"
                  type="date"
                  value={newHotel.checkInDate}
                  onChange={(e) => setNewHotel({ ...newHotel, checkInDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="checkOutDate">Check-out Date</Label>
                <Input
                  id="checkOutDate"
                  type="date"
                  value={newHotel.checkOutDate}
                  onChange={(e) => setNewHotel({ ...newHotel, checkOutDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reservationNumber">Reservation Number</Label>
              <Input
                id="reservationNumber"
                value={newHotel.reservationNumber}
                onChange={(e) => setNewHotel({ ...newHotel, reservationNumber: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newHotel.notes}
                onChange={(e) => setNewHotel({ ...newHotel, notes: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleAddHotel} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Adding..." : "Add Hotel"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="relative">
            <CardHeader>
              <CardTitle>{hotel.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing === hotel.id ? (
                <div className="space-y-2">
                  <Input
                    value={hotel.name}
                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                    placeholder="Hotel Name"
                  />
                  <Input
                    value={hotel.address}
                    onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                    placeholder="Address"
                  />
                  <Input
                    type="date"
                    value={hotel.checkInDate}
                    onChange={(e) => setNewHotel({ ...newHotel, checkInDate: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={hotel.checkOutDate}
                    onChange={(e) => setNewHotel({ ...newHotel, checkOutDate: e.target.value })}
                  />
                  <Input
                    value={hotel.reservationNumber}
                    onChange={(e) => setNewHotel({ ...newHotel, reservationNumber: e.target.value })}
                    placeholder="Reservation Number"
                  />
                  <Textarea
                    value={hotel.notes}
                    onChange={(e) => setNewHotel({ ...newHotel, notes: e.target.value })}
                    placeholder="Notes"
                  />
                  <Button onClick={() => handleUpdateHotel(hotel.id)} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Update
                  </Button>
                </div>
              ) : (
                <>
                  <p><strong>Address:</strong> {hotel.address}</p>
                  <p><strong>Check-in:</strong> {format(new Date(hotel.checkInDate), 'PPP')}</p>
                  <p><strong>Check-out:</strong> {format(new Date(hotel.checkOutDate), 'PPP')}</p>
                  <p><strong>Reservation Number:</strong> {hotel.reservationNumber}</p>
                  {hotel.notes && <p><strong>Notes:</strong> {hotel.notes}</p>}
                </>
              )}
            </CardContent>
            <div className="absolute top-2 right-2 space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(isEditing === hotel.id ? null : hotel.id)}
              >
                {isEditing === hotel.id ? 'Cancel' : 'Edit'}
              </Button>
              <Button 
                size="sm"
                variant="destructive" 
                onClick={() => handleDeleteHotel(hotel.id)}
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
