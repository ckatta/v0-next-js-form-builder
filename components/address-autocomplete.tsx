"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"

interface AddressResult {
  display_name: string
  address: {
    house_number?: string
    road?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
    country?: string
  }
  lat: string
  lon: string
}

interface AddressAutocompleteProps {
  id: string
  required?: boolean
  onChange?: (address: {
    fullAddress: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    latitude: number
    longitude: number
  }) => void
  defaultValue?: string
}

export default function AddressAutocomplete({
  id,
  required = false,
  onChange,
  defaultValue = "",
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue)
  const [results, setResults] = useState<AddressResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<{
    fullAddress: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    latitude: number
    longitude: number
  } | null>(null)
  const debouncedQuery = useDebounce(query, 500)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside the results dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Search for addresses when the debounced query changes
  useEffect(() => {
    async function searchAddresses() {
      if (!debouncedQuery || debouncedQuery.length < 3) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedQuery,
          )}&addressdetails=1&limit=5`,
        )
        const data = await response.json()
        setResults(data)
        setShowResults(true)
      } catch (error) {
        console.error("Error searching addresses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    searchAddresses()
  }, [debouncedQuery])

  const handleSelectAddress = (result: AddressResult) => {
    const address = result.address

    // Extract address components
    const street = [address.house_number, address.road].filter(Boolean).join(" ")
    const city = address.city || address.town || address.village || address.suburb || ""
    const state = address.state || ""
    const postalCode = address.postcode || ""
    const country = address.country || ""

    const fullAddress = result.display_name

    const selectedAddressData = {
      fullAddress,
      street,
      city,
      state,
      postalCode,
      country,
      latitude: Number.parseFloat(result.lat),
      longitude: Number.parseFloat(result.lon),
    }

    setSelectedAddress(selectedAddressData)
    setQuery(fullAddress)
    setShowResults(false)

    if (onChange) {
      onChange(selectedAddressData)
    }
  }

  const clearSelection = () => {
    setSelectedAddress(null)
    setQuery("")
    if (onChange) {
      onChange({
        fullAddress: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        latitude: 0,
        longitude: 0,
      })
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id={id}
            type="text"
            placeholder="Start typing an address..."
            className="pl-9 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) {
                setShowResults(true)
              }
            }}
            required={required}
          />
          {query && (
            <button
              type="button"
              onClick={clearSelection}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              aria-label="Clear address"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showResults && (
          <div
            ref={resultsRef}
            className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Searching addresses...</span>
              </div>
            ) : results.length > 0 ? (
              <ul className="max-h-60 overflow-auto py-1">
                {results.map((result, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      className="flex w-full items-start px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => handleSelectAddress(result)}
                    >
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                      <span className="line-clamp-2">{result.display_name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.length >= 3 ? (
              <div className="p-4 text-center text-sm text-gray-500">No addresses found</div>
            ) : null}
          </div>
        )}
      </div>

      {selectedAddress && (
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="text-sm">
            <div className="font-medium text-blue-800">Selected Address:</div>
            <div className="text-blue-700">{selectedAddress.fullAddress}</div>
            <div className="mt-1 text-xs text-blue-600">
              Lat: {selectedAddress.latitude.toFixed(6)}, Lng: {selectedAddress.longitude.toFixed(6)}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
