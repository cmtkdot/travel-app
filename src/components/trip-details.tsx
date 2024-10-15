"use client"

import React, { useState, useEffect } from "react"
import { BudgetTracker } from "./BudgetTracker"
import { PackingList } from "./PackingList"
import { ActivityManager } from "./ActivityManager"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useToast, Toast } from "./ui/use-toast"
import { format, parseISO } from 'date-fns'
import { supabase } from "../lib/supabase"

type Trip = {
  id: number
  destination: string
  start_date: string
  end_date: string
}

interface TripDetailsProps {
  trip: Trip
  onUpdateTrip: (updatedTrip: Trip) => void
}

export function TripDetails({ trip, onUpdateTrip }: TripDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast, showToast } = useToast()

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy')
    } catch (error) {
      console.error('Error parsing date:', error)
      return dateString // fallback to original string if parsing fails
    }
  }

  if (isLoading) {
    return <div>Loading trip details...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{trip.destination}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Start Date: {formatDate(trip.start_date)}</p>
          <p>End Date: {formatDate(trip.end_date)}</p>
        </CardContent>
      </Card>

      <BudgetTracker tripId={trip.id} />
      <PackingList tripId={trip.id} />
      <ActivityManager tripId={trip.id} />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
