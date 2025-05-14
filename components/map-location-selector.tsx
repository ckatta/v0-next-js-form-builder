"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface MapLocationSelectorProps {
  height?: number
  defaultLatitude?: number
  defaultLongitude?: number
  defaultZoom?: number
  onChange?: (location: { lat: number; lng: number; address: string }) => void
}

export default function MapLocationSelector({
  height = 300,
  defaultLatitude = 40.7128,
  defaultLongitude = -74.006,
  defaultZoom = 13,
  onChange,
}: MapLocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string }>({
    lat: defaultLatitude,
    lng: defaultLongitude,
    address: "New York, NY, USA",
  })

  // This would normally use a real map API like Google Maps or Mapbox
  // For this demo, we'll simulate the map with a placeholder
  const handleSearch = () => {
    if (searchQuery.trim() === "") return

    // Simulate geocoding - in a real app, this would call a geocoding API
    const simulatedLocations = {
      "new york": { lat: 40.7128, lng: -74.006, address: "New York, NY, USA" },
      "los angeles": { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA, USA" },
      chicago: { lat: 41.8781, lng: -87.6298, address: "Chicago, IL, USA" },
      london: { lat: 51.5074, lng: -0.1278, address: "London, UK" },
      paris: { lat: 48.8566, lng: 2.3522, address: "Paris, France" },
      tokyo: { lat: 35.6762, lng: 139.6503, address: "Tokyo, Japan" },
    }

    const query = searchQuery.toLowerCase()
    const matchedLocation = Object.entries(simulatedLocations).find(([key]) => key.includes(query))

    if (matchedLocation) {
      const [_, location] = matchedLocation
      setSelectedLocation(location)
      if (onChange) onChange(location)
    } else {
      // Simulate a random location near the equator if no match
      const randomLat = Math.random() * 10 - 5
      const randomLng = Math.random() * 20 - 10
      const newLocation = {
        lat: randomLat,
        lng: randomLng,
        address: `${searchQuery} (Simulated Location)`,
      }
      setSelectedLocation(newLocation)
      if (onChange) onChange(newLocation)
    }
  }

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // In a real app, this would get coordinates from the map click event
    // For this demo, we'll simulate a click by generating a location near the current one
    const offsetLat = (Math.random() - 0.5) * 0.02
    const offsetLng = (Math.random() - 0.5) * 0.02

    const newLocation = {
      lat: selectedLocation.lat + offsetLat,
      lng: selectedLocation.lng + offsetLng,
      address: `Dropped Pin (${(selectedLocation.lat + offsetLat).toFixed(6)}, ${(selectedLocation.lng + offsetLng).toFixed(6)})`,
    }

    setSelectedLocation(newLocation)
    if (onChange) onChange(newLocation)
  }

  const handleUseCurrentLocation = () => {
    // In a real app, this would use the browser's geolocation API
    // For this demo, we'll simulate getting the user's location
    const simulatedCurrentLocation = {
      lat: 37.7749,
      lng: -122.4194,
      address: "Current Location (San Francisco, CA)",
    }

    setSelectedLocation(simulatedCurrentLocation)
    if (onChange) onChange(simulatedCurrentLocation)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search for a location"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} type="button">
          Search
        </Button>
        <Button variant="outline" onClick={handleUseCurrentLocation} type="button">
          <Locate className="h-4 w-4 mr-2" />
          Current
        </Button>
      </div>

      <div
        className="relative border rounded-md bg-gray-100 overflow-hidden cursor-crosshair"
        style={{ height: `${height}px` }}
        onClick={handleMapClick}
      >
        {/* This would be a real map in a production app */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <p>Map Placeholder</p>
            <p className="text-xs">Click anywhere to select a location</p>
          </div>
        </div>

        {/* Simulated pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500">
          <MapPin className="h-8 w-8" />
        </div>
      </div>

      <Card className="p-3">
        <div className="text-sm">
          <div className="font-medium">Selected Location:</div>
          <div>{selectedLocation.address}</div>
          <div className="text-gray-500 text-xs mt-1">
            Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
          </div>
        </div>
      </Card>
    </div>
  )
}
