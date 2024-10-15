"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { CalendarDays, MapPin, Tag, Grid, List } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from '@/lib/supabase'

type Activity = {
  id: string
  name: string
  date: string
  location: string
  type: string
  image: string
}

export default function ActivityOverview() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'location'>('date')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [groupBy, setGroupBy] = useState<'none' | 'date' | 'location'>('none')

  const fetchActivities = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order(sortBy, { ascending: true })
      .range((page - 1) * 9, page * 9 - 1)

    if (error) {
      console.error('Error fetching activities:', error)
    } else {
      setActivities(prevActivities => [...prevActivities, ...data])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchActivities()
  }, [page, sortBy])

  const activityTypes = useMemo(() => {
    const types = new Set(activities.map(a => a.type))
    return ['all', ...Array.from(types)]
  }, [activities])

  const sortedAndFilteredActivities = useMemo(() => {
    return activities
      .filter(activity => 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(activity => filter === 'all' || activity.type === filter)
  }, [activities, searchTerm, filter])

  const groupedActivities = useMemo(() => {
    if (groupBy === 'none') return { 'All Activities': sortedAndFilteredActivities }
    return sortedAndFilteredActivities.reduce((acc, activity) => {
      const key = groupBy === 'date' ? activity.date : activity.location
      if (!acc[key]) acc[key] = []
      acc[key].push(activity)
      return acc
    }, {} as Record<string, Activity[]>)
  }, [sortedAndFilteredActivities, groupBy])

  const handleSort = (newSortBy: 'date' | 'type' | 'location') => {
    setSortBy(newSortBy)
    setActivities([])
    setPage(1)
  }

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return
    setPage(prevPage => prevPage + 1)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Trip Activities</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sortBy} onValueChange={(value: string) => handleSort(value as 'date' | 'type' | 'location')}>
          <option value="date">Sort by Date</option>
          <option value="type">Sort by Type</option>
          <option value="location">Sort by Location</option>
        </Select>
        <Select value={filter} onValueChange={(value: string) => setFilter(value)}>
          {activityTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </Select>
        <Select value={groupBy} onValueChange={(value: string) => setGroupBy(value as 'none' | 'date' | 'location')}>
          <option value="none">No Grouping</option>
          <option value="date">Group by Date</option>
          <option value="location">Group by Location</option>
        </Select>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value: string) => setViewMode(value as 'grid' | 'list')}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {loading && activities.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        Object.entries(groupedActivities).map(([group, activities]) => (
          <div key={group}>
            <h3 className="text-2xl font-semibold mt-8 mb-4">{group}</h3>
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {activities.map((activity) => (
                <Link href={`/activity/${activity.id}`} key={activity.id}>
                  <div className={`border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`relative ${viewMode === 'grid' ? 'h-48' : 'h-24 w-24'}`}>
                      <Image
                        src={activity.image}
                        alt={activity.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-xl mb-2">{activity.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Tag className="w-4 h-4 mr-2" />
                        <span>{activity.type}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
      {!loading && Object.values(groupedActivities).flat().length === 0 && (
        <p className="text-center text-gray-500 mt-8">No activities found. Try adjusting your search or filters.</p>
      )}
      {!loading && activities.length % 9 === 0 && (
        <Button onClick={() => setPage(prevPage => prevPage + 1)} className="mt-8 mx-auto block">
          Load More
        </Button>
      )}
    </div>
  )
}
