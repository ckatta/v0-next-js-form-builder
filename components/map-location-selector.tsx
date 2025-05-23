"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Locate } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Initialize map when component mounts
  useEffect(() => {
    // Only run this on the client side
    if (typeof window === "undefined" || !mapRef.current) return

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      try {
        // Add Leaflet CSS
        const linkEl = document.createElement("link")
        linkEl.rel = "stylesheet"
        linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(linkEl)

        // Wait for CSS to load
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Load Leaflet JS
        const L = await import("leaflet")

        // Initialize map if it doesn't exist yet
        if (!leafletMapRef.current) {
          leafletMapRef.current = L.map(mapRef.current).setView(
            [selectedLocation.lat, selectedLocation.lng],
            defaultZoom,
          )

          // Add tile layer (OpenStreetMap)
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(leafletMapRef.current)

          // Add marker for selected location
          markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], {
            draggable: true,
          }).addTo(leafletMapRef.current)

          // Handle marker drag events
          markerRef.current.on("dragend", async () => {
            const position = markerRef.current.getLatLng()
            const newLocation = {
              lat: position.lat,
              lng: position.lng,
              address: await reverseGeocode(position.lat, position.lng),
            }
            setSelectedLocation(newLocation)
            if (onChange) onChange(newLocation)
          })

          // Handle map click events
          leafletMapRef.current.on("click", async (e: any) => {
            const { lat, lng } = e.latlng
            markerRef.current.setLatLng([lat, lng])

            const newLocation = {
              lat,
              lng,
              address: await reverseGeocode(lat, lng),
            }
            setSelectedLocation(newLocation)
            if (onChange) onChange(newLocation)
          })
        }
      } catch (error) {
        console.error("Error loading Leaflet:", error)
      }
    }

    loadLeaflet()

    // Cleanup on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [defaultZoom, onChange, selectedLocation.lat, selectedLocation.lng])

  // Geocode address to coordinates
  const geocodeAddress = async (address: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        return {
          lat: Number.parseFloat(result.lat),
          lng: Number.parseFloat(result.lon),
          address: result.display_name,
        }
      }
      return null
    } catch (error) {
      console.error("Geocoding error:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return

    const location = await geocodeAddress(searchQuery)
    if (location) {
      setSelectedLocation(location)

      // Update map view and marker if map is initialized
      if (leafletMapRef.current && markerRef.current) {
        leafletMapRef.current.setView([location.lat, location.lng], leafletMapRef.current.getZoom())
        markerRef.current.setLatLng([location.lat, location.lng])
      }

      if (onChange) onChange(location)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const address = await reverseGeocode(latitude, longitude)

          const newLocation = {
            lat: latitude,
            lng: longitude,
            address,
          }

          setSelectedLocation(newLocation)

          // Update map view and marker if map is initialized
          if (leafletMapRef.current && markerRef.current) {
            leafletMapRef.current.setView([latitude, longitude], leafletMapRef.current.getZoom())
            markerRef.current.setLatLng([latitude, longitude])
          }

          if (onChange) onChange(newLocation)
        },
        (error) => {
          console.error("Geolocation error:", error)
          alert("Unable to retrieve your location. Please check your browser permissions.")
        },
      )
    } else {
      alert("Geolocation is not supported by your browser")
    }
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
        <Button onClick={handleSearch} type="button" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
        <Button variant="outline" onClick={handleUseCurrentLocation} type="button">
          <Locate className="h-4 w-4 mr-2" />
          Current
        </Button>
      </div>

      <div ref={mapRef} className="relative border rounded-md overflow-hidden" style={{ height: `${height}px` }}>
        {/* Loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 pointer-events-none opacity-0">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>

      <Card className="p-3">
        <div className="text-sm">
          <div className="font-medium">Selected Location:</div>
          <div className="text-gray-700 break-words">{selectedLocation.address}</div>
          <div className="text-gray-500 text-xs mt-1">
            Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
          </div>
        </div>
      </Card>
    </div>
  )
}
