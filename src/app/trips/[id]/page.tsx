"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { TripDetails } from '../../../components/trip-details'
import { supabase } from '../../../lib/supabase'

type Trip = {
  id: number
  destination: string
  start_date: string
  end_date: string
}

export default function TripPage() {
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)

  useEffect(() => {
    fetchTrip()
  }, [])

  async function fetchTrip() {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setTrip(data)
    } catch (error) {
      console.error('Error fetching trip:', error)
    }
  }

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update(updatedTrip)
        .eq('id', updatedTrip.id)

      if (error) throw error

      setTrip(updatedTrip)
    } catch (error) {
      console.error('Error updating trip:', error)
    }
  }

  if (!trip) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Trip Details</h1>
      <TripDetails trip={trip} onUpdateTrip={handleUpdateTrip} />
    </div>
  )
}
