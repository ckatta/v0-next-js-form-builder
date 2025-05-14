"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FieldSelectorProps {
  onSelect: (type: string) => void
  onClose: () => void
}

export default function FieldSelector({ onSelect, onClose }: FieldSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const fieldTypes = {
    basic: [
      { type: "text", label: "Text Input" },
      { type: "textarea", label: "Text Area" },
      { type: "email", label: "Email" },
      { type: "password", label: "Password" },
      { type: "number", label: "Number" },
      { type: "select", label: "Select Dropdown" },
      { type: "checkbox", label: "Checkbox Group" },
      { type: "radio", label: "Radio Group" },
    ],
    advanced: [
      { type: "date", label: "Date" },
      { type: "time", label: "Time" },
      { type: "datetime", label: "Date & Time" },
      { type: "daterange", label: "Date Range" },
      { type: "datetimerange", label: "Date & Time Range" },
      { type: "tel", label: "Phone" },
      { type: "url", label: "URL" },
      { type: "file", label: "File Upload" },
      { type: "range", label: "Range Slider" },
      { type: "color", label: "Color Picker" },
      { type: "rating", label: "Rating" },
      { type: "richtext", label: "Rich Text Editor" },
      { type: "markdown", label: "Markdown Editor" },
      { type: "code", label: "Code Editor" },
      { type: "multiselect", label: "Multi-Select" },
    ],
    specialized: [
      { type: "image", label: "Image Upload" },
      { type: "signature", label: "Signature" },
      { type: "address", label: "Address" },
      { type: "location", label: "Location Map" },
      { type: "captcha", label: "CAPTCHA" },
      { type: "hidden", label: "Hidden Field" },
    ],
    analytics: [
      { type: "barchart", label: "Bar Chart" },
      { type: "linechart", label: "Line Chart" },
      { type: "piechart", label: "Pie Chart" },
      { type: "datatable", label: "Data Table" },
      { type: "gauge", label: "Gauge Meter" },
      { type: "metrics", label: "Metrics Dashboard" },
    ],
  }

  const filterFields = (fields: { type: string; label: string }[]) => {
    if (!searchQuery) return fields
    return fields.filter((field) => field.label.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const allFields = [...fieldTypes.basic, ...fieldTypes.advanced, ...fieldTypes.specialized, ...fieldTypes.analytics]

  const filteredFields = filterFields(allFields)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Add Field</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search field types..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <div className="grid grid-cols-3 gap-2">
          {filteredFields.map((field) => (
            <Button
              key={field.type}
              variant="outline"
              className="justify-start h-auto py-2 px-3"
              onClick={() => onSelect(field.type)}
            >
              {field.label}
            </Button>
          ))}
          {filteredFields.length === 0 && <div className="col-span-3 text-center py-2">No matching field types</div>}
        </div>
      ) : (
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="specialized">Specialized</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="grid grid-cols-3 gap-2 mt-2">
            {fieldTypes.basic.map((field) => (
              <Button
                key={field.type}
                variant="outline"
                className="justify-start h-auto py-2 px-3"
                onClick={() => onSelect(field.type)}
              >
                {field.label}
              </Button>
            ))}
          </TabsContent>

          <TabsContent value="advanced" className="grid grid-cols-3 gap-2 mt-2">
            {fieldTypes.advanced.map((field) => (
              <Button
                key={field.type}
                variant="outline"
                className="justify-start h-auto py-2 px-3"
                onClick={() => onSelect(field.type)}
              >
                {field.label}
              </Button>
            ))}
          </TabsContent>

          <TabsContent value="specialized" className="grid grid-cols-3 gap-2 mt-2">
            {fieldTypes.specialized.map((field) => (
              <Button
                key={field.type}
                variant="outline"
                className="justify-start h-auto py-2 px-3"
                onClick={() => onSelect(field.type)}
              >
                {field.label}
              </Button>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="grid grid-cols-3 gap-2 mt-2">
            {fieldTypes.analytics.map((field) => (
              <Button
                key={field.type}
                variant="outline"
                className="justify-start h-auto py-2 px-3"
                onClick={() => onSelect(field.type)}
              >
                {field.label}
              </Button>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
