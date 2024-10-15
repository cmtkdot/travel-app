"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useToast, Toast } from "../components/ui/use-toast"
import { Spinner } from "../components/ui/spinner"
import { supabase } from "../lib/supabase"

type Activity = {
  id: number
  title: string
  description: string
  date: string
  start_time: string
  end_time: string
  location: string
  price: number
}

const ITEMS_PER_PAGE = 5

function validateActivity(activity: Omit<Activity, 'id'>): string[] {
  const errors: string[] = []
  if (!activity.title.trim()) errors.push("Title is required")
  if (!activity.date) errors.push("Date is required")
  if (activity.price < 0) errors.push("Price cannot be negative")
  return errors
}

export function ActivityManager({ tripId }: { tripId: number }): React.ReactElement {
  const [activities, setActivities] = useState<Activity[]>([])
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    price: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)
  const { toast, showToast } = useToast()

  useEffect(() => {
    fetchActivities()
  }, [tripId, currentPage])

  async function fetchActivities() {
    setIsLoading(true)
    try {
      const { data, error, count } = await supabase
        .from('activities')
        .select('*', { count: 'exact' })
        .eq('trip_id', tripId)
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
        .order('date', { ascending: true })

      if (error) throw error

      setActivities(data || [])
      setTotalActivities(count || 0)
    } catch (error) {
      console.error('Error fetching activities:', error)
      showToast({
        message: "Failed to fetch activities",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function addActivity(e: React.FormEvent) {
    e.preventDefault()
    const errors = validateActivity(newActivity)
    if (errors.length > 0) {
      showToast({
        message: errors.join(", "),
        type: "error",
      })
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([
          { ...newActivity, trip_id: tripId }
        ])
        .select()

      if (error) throw error

      setActivities([...activities, data[0]])
      setNewActivity({
        title: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
        price: 0
      })
      showToast({
        message: "Activity added successfully",
        type: "success",
      })
      fetchActivities() // Refresh the list after adding
    } catch (error) {
      console.error('Error adding activity:', error)
      showToast({
        message: "Failed to add activity",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateActivity(id: number, updatedActivity: Partial<Activity>) {
    const currentActivity = activities.find(a => a.id === id)
    if (!currentActivity) return

    const errors = validateActivity({ ...currentActivity, ...updatedActivity })
    if (errors.length > 0) {
      showToast({
        message: errors.join(", "),
        type: "error",
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('activities')
        .update(updatedActivity)
        .eq('id', id)

      if (error) throw error

      showToast({
        message: "Activity updated successfully",
        type: "success",
      })
      setEditingActivity(null)
      fetchActivities() // Refresh the list after updating
    } catch (error) {
      console.error('Error updating activity:', error)
      showToast({
        message: "Failed to update activity",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function removeActivity(id: number) {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)

      if (error) throw error

      showToast({
        message: "Activity removed successfully",
        type: "success",
      })
      fetchActivities() // Refresh the list after removing
    } catch (error) {
      console.error('Error removing activity:', error)
      showToast({
        message: "Failed to remove activity",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addActivity} className="space-y-4">
          <div>
            <Label htmlFor="activityTitle">Activity Title</Label>
            <Input
              id="activityTitle"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="activityDescription">Description</Label>
            <Textarea
              id="activityDescription"
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="activityDate">Date</Label>
            <Input
              id="activityDate"
              type="date"
              value={newActivity.date}
              onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="activityStartTime">Start Time</Label>
            <Input
              id="activityStartTime"
              type="time"
              value={newActivity.start_time}
              onChange={(e) => setNewActivity({ ...newActivity, start_time: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="activityEndTime">End Time</Label>
            <Input
              id="activityEndTime"
              type="time"
              value={newActivity.end_time}
              onChange={(e) => setNewActivity({ ...newActivity, end_time: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="activityLocation">Location</Label>
            <Input
              id="activityLocation"
              value={newActivity.location}
              onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="activityPrice">Price</Label>
            <Input
              id="activityPrice"
              type="number"
              value={newActivity.price}
              onChange={(e) => setNewActivity({ ...newActivity, price: parseFloat(e.target.value) })}
            />
          </div>
          <Button type="submit" disabled={isLoading}>Add Activity</Button>
        </form>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Planned Activities</h3>
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {activities.map((activity) => (
                <Card key={activity.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{activity.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingActivity && editingActivity.id === activity.id ? (
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        updateActivity(activity.id, editingActivity)
                      }} className="space-y-4">
                        <Input
                          value={editingActivity.title}
                          onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                          aria-label="Edit activity title"
                        />
                        <Textarea
                          value={editingActivity.description}
                          onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                          aria-label="Edit activity description"
                        />
                        <Input
                          type="date"
                          value={editingActivity.date}
                          onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                          aria-label="Edit activity date"
                        />
                        <Input
                          type="time"
                          value={editingActivity.start_time}
                          onChange={(e) => setEditingActivity({ ...editingActivity, start_time: e.target.value })}
                          aria-label="Edit activity start time"
                        />
                        <Input
                          type="time"
                          value={editingActivity.end_time}
                          onChange={(e) => setEditingActivity({ ...editingActivity, end_time: e.target.value })}
                          aria-label="Edit activity end time"
                        />
                        <Input
                          value={editingActivity.location}
                          onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                          aria-label="Edit activity location"
                        />
                        <Input
                          type="number"
                          value={editingActivity.price}
                          onChange={(e) => setEditingActivity({ ...editingActivity, price: parseFloat(e.target.value) })}
                          aria-label="Edit activity price"
                        />
                        <Button type="submit" disabled={isLoading}>Save</Button>
                        <Button type="button" onClick={() => setEditingActivity(null)}>Cancel</Button>
                      </form>
                    ) : (
                      <>
                        <p>{activity.description}</p>
                        <p className="text-sm text-muted-foreground">Date: {activity.date}</p>
                        <p className="text-sm text-muted-foreground">Time: {activity.start_time} - {activity.end_time}</p>
                        <p className="text-sm text-muted-foreground">Location: {activity.location}</p>
                        <p className="text-sm text-muted-foreground">Price: ${activity.price}</p>
                        <div className="mt-2 space-x-2">
                          <Button onClick={() => setEditingActivity(activity)} aria-label={`Edit ${activity.title}`}>Edit</Button>
                          <Button variant="destructive" onClick={() => removeActivity(activity.id)} aria-label={`Remove ${activity.title}`}>Remove</Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-between items-center mt-4">
                <Button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </Card>
  )
}
