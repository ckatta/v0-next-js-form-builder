"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateTimeRangePickerProps {
  id: string
  required?: boolean
  onChange?: (value: { start: string; end: string; duration: string }) => void
  defaultStart?: string
  defaultEnd?: string
}

export default function DateTimeRangePicker({
  id,
  required = false,
  onChange,
  defaultStart = "",
  defaultEnd = "",
}: DateTimeRangePickerProps) {
  const [startDateTime, setStartDateTime] = useState(defaultStart)
  const [endDateTime, setEndDateTime] = useState(defaultEnd)
  const [duration, setDuration] = useState("")
  const [error, setError] = useState("")

  // Calculate duration whenever dates or times change
  useEffect(() => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime)
      const end = new Date(endDateTime)

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        if (end < start) {
          setError("End date/time must be after start date/time")
          setDuration("")
        } else {
          setError("")
          const diff = end.getTime() - start.getTime()
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

          let durationText = ""
          if (days > 0) durationText += `${days} day${days !== 1 ? "s" : ""} `
          if (hours > 0) durationText += `${hours} hour${hours !== 1 ? "s" : ""} `
          if (minutes > 0) durationText += `${minutes} minute${minutes !== 1 ? "s" : ""}`
          if (durationText === "") durationText = "0 minutes"

          setDuration(durationText.trim())

          if (onChange) {
            onChange({
              start: startDateTime,
              end: endDateTime,
              duration: durationText,
            })
          }
        }
      }
    }
  }, [startDateTime, endDateTime, onChange])

  // Set default end time to 1 hour after start time when start time is selected
  useEffect(() => {
    if (startDateTime && !endDateTime) {
      const start = new Date(startDateTime)
      if (!isNaN(start.getTime())) {
        const suggestedEnd = new Date(start.getTime() + 60 * 60 * 1000) // Add 1 hour
        setEndDateTime(suggestedEnd.toISOString().slice(0, 16))
      }
    }
  }, [startDateTime, endDateTime])

  // Helper function to get current datetime in YYYY-MM-DDThh:mm format
  const getCurrentDateTime = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  }

  const handleQuickSelect = (option: string) => {
    const now = new Date()

    switch (option) {
      case "1hour":
        {
          const start = now
          const end = new Date(start.getTime() + 60 * 60 * 1000) // Add 1 hour

          setStartDateTime(start.toISOString().slice(0, 16))
          setEndDateTime(end.toISOString().slice(0, 16))
        }
        break
      case "today":
        {
          const start = new Date(now)
          start.setHours(9, 0, 0, 0)

          const end = new Date(now)
          end.setHours(17, 0, 0, 0)

          setStartDateTime(start.toISOString().slice(0, 16))
          setEndDateTime(end.toISOString().slice(0, 16))
        }
        break
      case "tomorrow":
        {
          const tomorrow = new Date(now)
          tomorrow.setDate(tomorrow.getDate() + 1)

          const start = new Date(tomorrow)
          start.setHours(9, 0, 0, 0)

          const end = new Date(tomorrow)
          end.setHours(17, 0, 0, 0)

          setStartDateTime(start.toISOString().slice(0, 16))
          setEndDateTime(end.toISOString().slice(0, 16))
        }
        break
      case "weekend":
        {
          const today = new Date()
          const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7
          const saturday = new Date(today)
          saturday.setDate(today.getDate() + daysUntilSaturday)
          saturday.setHours(9, 0, 0, 0)

          const sunday = new Date(saturday)
          sunday.setDate(saturday.getDate() + 1)
          sunday.setHours(17, 0, 0, 0)

          setStartDateTime(saturday.toISOString().slice(0, 16))
          setEndDateTime(sunday.toISOString().slice(0, 16))
        }
        break
      case "week":
        {
          const today = new Date()
          const startOfWeek = new Date(today)
          const dayOfWeek = today.getDay()
          const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
          startOfWeek.setDate(diff)
          startOfWeek.setHours(9, 0, 0, 0)

          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 4)
          endOfWeek.setHours(17, 0, 0, 0)

          setStartDateTime(startOfWeek.toISOString().slice(0, 16))
          setEndDateTime(endOfWeek.toISOString().slice(0, 16))
        }
        break
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Timer className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-500">Quick Select:</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleQuickSelect("1hour")}>
            Next Hour
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickSelect("today")}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickSelect("tomorrow")}>
            Tomorrow
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                More...
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="grid gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => handleQuickSelect("weekend")}
                >
                  This weekend
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => handleQuickSelect("week")}
                >
                  This work week
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${id}-start`} className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            Start Date & Time
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={`${id}-start`}
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            required={required}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${id}-end`} className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            End Date & Time
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={`${id}-end`}
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            required={required}
            className={cn("mt-1", error && "border-red-500")}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {duration && !error && (
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span className="font-medium">Duration:</span>
            <span className="ml-2">{duration}</span>
          </div>
        </Card>
      )}
    </div>
  )
}
