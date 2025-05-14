"use client"

import type React from "react"
import { useState } from "react"
import { Star, Link, Code, RefreshCw, X, EyeOff, BarChart } from "lucide-react"

import type { FormSchema } from "./form-builder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import MapLocationSelector from "./map-location-selector"
import MetricsGenerator from "./metrics-generator"
import DateTimeRangePicker from "./datetime-range-picker"
import ImageSelector from "./image-selector"

interface FormPreviewProps {
  schema?: FormSchema
}

export default function FormPreview({ schema }: FormPreviewProps) {
  const [showMetrics, setShowMetrics] = useState(false)

  // Add a default empty schema if none is provided
  const formSchema = schema || { title: "Untitled Form", fields: [] }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Form submitted! In a real app, this would save the data.")
  }

  // Mock data for charts
  const mockBarChartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
  ]

  const mockLineChartData = [
    { name: "Week 1", value: 40 },
    { name: "Week 2", value: 30 },
    { name: "Week 3", value: 45 },
    { name: "Week 4", value: 80 },
    { name: "Week 5", value: 65 },
  ]

  const mockPieChartData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{formSchema.title}</h2>
        {formSchema.fields && formSchema.fields.length > 0 && (
          <Button variant="outline" onClick={() => setShowMetrics(!showMetrics)} className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            {showMetrics ? "Hide Metrics" : "Show Metrics"}
          </Button>
        )}
      </div>

      {showMetrics && formSchema && (
        <div className="mb-8">
          <MetricsGenerator schema={formSchema} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {formSchema.fields &&
          formSchema.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              {field.type !== "hidden" && field.type !== "datetimerange" && (
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              )}

              {field.type === "text" && (
                <Input id={field.id} type="text" placeholder={field.placeholder} required={field.required} />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={field.rows || 3}
                />
              )}

              {field.type === "email" && (
                <Input id={field.id} type="email" placeholder={field.placeholder} required={field.required} />
              )}

              {field.type === "number" && (
                <Input
                  id={field.id}
                  type="number"
                  placeholder={field.placeholder}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                />
              )}

              {field.type === "date" && <Input id={field.id} type="date" required={field.required} />}

              {field.type === "tel" && (
                <Input id={field.id} type="tel" placeholder={field.placeholder} required={field.required} />
              )}

              {field.type === "url" && (
                <Input id={field.id} type="url" placeholder={field.placeholder} required={field.required} />
              )}

              {field.type === "file" && (
                <Input id={field.id} type="file" required={field.required} accept={field.accept} />
              )}

              {field.type === "checkbox" && field.options && (
                <div className="space-y-2">
                  {field.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`${field.id}-${index}`} />
                      <Label htmlFor={`${field.id}-${index}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "radio" && field.options && (
                <RadioGroup>
                  {field.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${field.id}-${index}`} />
                      <Label htmlFor={`${field.id}-${index}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {field.type === "select" && field.options && (
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "password" && (
                <Input id={field.id} type="password" placeholder={field.placeholder} required={field.required} />
              )}

              {field.type === "time" && <Input id={field.id} type="time" required={field.required} />}

              {field.type === "datetime" && <Input id={field.id} type="datetime-local" required={field.required} />}

              {field.type === "daterange" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`${field.id}-start`}>Start</Label>
                    <Input id={`${field.id}-start`} type="date" required={field.required} />
                  </div>
                  <div>
                    <Label htmlFor={`${field.id}-end`}>End</Label>
                    <Input id={`${field.id}-end`} type="date" required={field.required} />
                  </div>
                </div>
              )}

              {field.type === "datetimerange" && (
                <div>
                  <Label htmlFor={field.id} className="mb-2 block">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <DateTimeRangePicker id={field.id} required={field.required} />
                </div>
              )}

              {field.type === "color" && (
                <div className="flex items-center gap-2">
                  <Input id={field.id} type="color" className="w-12 h-10 p-1" required={field.required} />
                  <Input
                    type="text"
                    placeholder="#RRGGBB"
                    className="flex-1"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              )}

              {field.type === "range" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{field.min || "0"}</span>
                    <span>
                      {field.max
                        ? Math.floor(Number.parseInt(field.min || "0") + Number.parseInt(field.max || "100")) / 2
                        : "50"}
                    </span>
                    <span>{field.max || "100"}</span>
                  </div>
                  <Input
                    id={field.id}
                    type="range"
                    min={field.min || "0"}
                    max={field.max || "100"}
                    step={field.step || "1"}
                    defaultValue={field.defaultValue?.toString() || "50"}
                    required={field.required}
                    className="w-full"
                  />
                </div>
              )}

              {field.type === "rating" && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="text-gray-300 hover:text-yellow-400 focus:text-yellow-400"
                      aria-label={`Rate ${value} stars`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              )}

              {field.type === "richtext" && (
                <div className="border rounded-md p-1">
                  <div className="flex flex-wrap gap-1 border-b p-1 mb-2">
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Bold</span>
                      <span className="font-bold">B</span>
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Italic</span>
                      <span className="italic">I</span>
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Underline</span>
                      <span className="underline">U</span>
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-8 px-2">
                      <span className="sr-only">Heading</span>
                      <span>Heading</span>
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-8 px-2">
                      <span className="sr-only">Link</span>
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder || "Enter rich text..."}
                    required={field.required}
                    className="border-0"
                    rows={field.rows || 5}
                  />
                </div>
              )}

              {field.type === "markdown" && (
                <div className="border rounded-md overflow-hidden">
                  <div className="flex border-b bg-gray-50">
                    <button type="button" className="px-4 py-2 font-medium border-r">
                      Edit
                    </button>
                    <button type="button" className="px-4 py-2 text-gray-500">
                      Preview
                    </button>
                  </div>
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder || "# Markdown\nWrite your content using **markdown**"}
                    required={field.required}
                    className="border-0 min-h-[200px] font-mono"
                    rows={field.rows || 5}
                  />
                </div>
              )}

              {field.type === "code" && (
                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-1">
                    <select className="text-sm bg-transparent border-0">
                      <option>{field.language || "JavaScript"}</option>
                      <option>HTML</option>
                      <option>CSS</option>
                      <option>JSON</option>
                    </select>
                    <Button type="button" variant="ghost" size="sm">
                      <Code className="h-4 w-4 mr-1" />
                      Format
                    </Button>
                  </div>
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder || "// Write your code here"}
                    required={field.required}
                    className="border-0 min-h-[200px] font-mono"
                    rows={field.rows || 8}
                  />
                </div>
              )}

              {field.type === "image" && (
                <ImageSelector id={field.id} required={field.required} accept={field.accept || "image/*"} maxSize={5} />
              )}

              {field.type === "signature" && (
                <div className="space-y-2">
                  <div className="border rounded-md h-[150px] flex items-center justify-center bg-gray-50">
                    <p className="text-gray-400">Click here to sign</p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Clear Signature
                  </Button>
                </div>
              )}

              {field.type === "address" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`${field.id}-street`}>Street Address</Label>
                    <Input id={`${field.id}-street`} placeholder="123 Main St" required={field.required} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`${field.id}-city`}>City</Label>
                      <Input id={`${field.id}-city`} placeholder="City" />
                    </div>
                    <div>
                      <Label htmlFor={`${field.id}-state`}>State/Province</Label>
                      <Input id={`${field.id}-state`} placeholder="State" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`${field.id}-zip`}>ZIP/Postal Code</Label>
                      <Input id={`${field.id}-zip`} placeholder="ZIP Code" />
                    </div>
                    <div>
                      <Label htmlFor={`${field.id}-country`}>Country</Label>
                      <Select>
                        <SelectTrigger id={`${field.id}-country`}>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {field.type === "location" && (
                <div className="space-y-2">
                  <MapLocationSelector
                    height={250}
                    defaultLatitude={field.latitude}
                    defaultLongitude={field.longitude}
                    defaultZoom={field.zoom || 13}
                  />
                </div>
              )}

              {field.type === "captcha" && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium">Verify you're human</div>
                    <Button type="button" variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-white border p-2 mb-3 text-center">
                    <div className="font-mono text-lg tracking-widest text-gray-700 select-none">XJ9P2R</div>
                  </div>
                  <Input placeholder="Enter the code above" required={field.required} />
                </div>
              )}

              {field.type === "multiselect" && field.options && (
                <div className="border rounded-md p-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {field.options.slice(0, 2).map((option, index) => (
                      <div key={index} className="bg-gray-100 rounded-md px-2 py-1 text-sm flex items-center">
                        {option.label}
                        <button type="button" className="ml-1 text-gray-500 hover:text-gray-700">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Input placeholder={field.placeholder || "Select options..."} />
                </div>
              )}

              {field.type === "hidden" && (
                <div className="bg-gray-50 border rounded-md p-2">
                  <div className="flex items-center">
                    <EyeOff className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Hidden field (not visible to users)</span>
                  </div>
                  <Input type="hidden" id={field.id} value={field.value || "hidden-value"} />
                </div>
              )}

              {field.type === "barchart" && (
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">{field.label || "Bar Chart"}</h4>
                    <div className="flex gap-1">
                      <Button type="button" variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="h-[200px] bg-gray-50 border rounded-md p-2 flex items-end justify-around">
                    {mockBarChartData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-12 bg-blue-500 rounded-t-sm"
                          style={{ height: `${(item.value / 800) * 150}px` }}
                        ></div>
                        <div className="text-xs mt-1">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {field.type === "linechart" && (
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">{field.label || "Line Chart"}</h4>
                    <div className="flex gap-1">
                      <Button type="button" variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="h-[200px] bg-gray-50 border rounded-md p-2 relative">
                    <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <polyline
                        points="0,150 100,90 200,120 300,30 400,60"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4">
                      {mockLineChartData.map((item, index) => (
                        <div key={index} className="text-xs">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {field.type === "piechart" && (
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">{field.label || "Pie Chart"}</h4>
                    <div className="flex gap-1">
                      <Button type="button" variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="h-[200px] bg-gray-50 border rounded-md p-2 flex justify-center items-center">
                    <div className="w-32 h-32 rounded-full border-8 border-blue-500 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1/2 h-full bg-green-500"></div>
                      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yellow-500"></div>
                      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-red-500"></div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <div className="w-3 h-3 bg-blue-500"></div>
                        <div>Group A (33%)</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <div className="w-3 h-3 bg-green-500"></div>
                        <div>Group B (25%)</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <div className="w-3 h-3 bg-yellow-500"></div>
                        <div>Group C (25%)</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 bg-red-500"></div>
                        <div>Group D (17%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {field.type === "datatable" && (
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">{field.label || "Data Table"}</h4>
                    <div className="flex gap-1">
                      <Button type="button" variant="outline" size="sm">
                        Export CSV
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Name</th>
                          <th className="px-4 py-2 text-left font-medium">Category</th>
                          <th className="px-4 py-2 text-left font-medium">Value</th>
                          <th className="px-4 py-2 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4].map((row) => (
                          <tr key={row} className="border-t">
                            <td className="px-4 py-2">Item {row}</td>
                            <td className="px-4 py-2">Category {Math.ceil(row / 2)}</td>
                            <td className="px-4 py-2">${row * 100}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  row % 3 === 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : row % 2 === 0
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {row % 3 === 0 ? "Pending" : row % 2 === 0 ? "Completed" : "Active"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {field.type === "gauge" && (
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">{field.label || "Gauge Meter"}</h4>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-20 overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 h-40 w-40 rounded-full border-8 border-gray-200"></div>
                      <div
                        className="absolute bottom-0 left-0 right-0 h-40 w-40 rounded-full border-t-8 border-l-8 border-r-8 border-blue-500"
                        style={{
                          clipPath: "polygon(50% 50%, 0 0, 100% 0)",
                          transform: "rotate(45deg)",
                        }}
                      ></div>
                      <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-black -ml-0.5"></div>
                    </div>
                    <div className="text-2xl font-bold mt-2">65%</div>
                    <div className="text-sm text-gray-500">{field.placeholder || "Performance"}</div>
                  </div>
                </div>
              )}

              {field.type === "metrics" && (
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">{field.label || "Metrics Dashboard"}</h4>
                    <Tabs defaultValue="day" className="w-auto">
                      <TabsList className="h-8">
                        <TabsTrigger value="day" className="text-xs px-2 h-6">
                          Day
                        </TabsTrigger>
                        <TabsTrigger value="week" className="text-xs px-2 h-6">
                          Week
                        </TabsTrigger>
                        <TabsTrigger value="month" className="text-xs px-2 h-6">
                          Month
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <Card className="p-3">
                      <div className="text-sm text-gray-500">Total Users</div>
                      <div className="text-2xl font-bold">1,245</div>
                      <div className="text-xs text-green-500">+12.3%</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-sm text-gray-500">Conversion</div>
                      <div className="text-2xl font-bold">24.5%</div>
                      <div className="text-xs text-red-500">-2.1%</div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-sm text-gray-500">Revenue</div>
                      <div className="text-2xl font-bold">$12,345</div>
                      <div className="text-xs text-green-500">+8.7%</div>
                    </Card>
                  </div>
                  <div className="h-[150px] bg-gray-50 border rounded-md p-2 relative">
                    <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <polyline
                        points="0,120 100,100 200,80 300,30 400,70 500,40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />
                      <polyline
                        points="0,140 100,150 200,120 300,90 400,100 500,80"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}

        {formSchema.fields && formSchema.fields.length > 0 && (
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        )}

        {(!formSchema.fields || formSchema.fields.length === 0) && (
          <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500">Add fields to your form to see the preview</p>
          </div>
        )}
      </form>
    </div>
  )
}
