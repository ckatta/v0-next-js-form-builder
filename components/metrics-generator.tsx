"use client"

import { useState } from "react"
import { BarChart, PieChart, LineChart, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FormSchema } from "./form-builder"

interface MetricsGeneratorProps {
  schema: FormSchema
}

export default function MetricsGenerator({ schema }: MetricsGeneratorProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isGenerating, setIsGenerating] = useState(false)

  // Calculate form complexity score (0-100)
  const calculateComplexityScore = (): number => {
    if (!schema.fields.length) return 0

    // Base score based on number of fields
    let score = Math.min(schema.fields.length * 5, 40)

    // Add points for required fields
    const requiredFields = schema.fields.filter((field) => field.required)
    score += requiredFields.length * 2

    // Add points for validation
    schema.fields.forEach((field) => {
      if (field.pattern) score += 3
      if (field.minLength || field.maxLength) score += 2
      if (field.min || field.max) score += 2
      if (field.validateRange) score += 3
    })

    // Add points for advanced field types
    const advancedTypes = ["richtext", "markdown", "code", "location", "datetimerange", "signature", "address"]
    schema.fields.forEach((field) => {
      if (advancedTypes.includes(field.type)) score += 4
    })

    return Math.min(score, 100)
  }

  // Estimate completion time in seconds
  const estimateCompletionTime = (): number => {
    if (!schema.fields.length) return 0

    let time = 0

    schema.fields.forEach((field) => {
      // Base time per field type
      switch (field.type) {
        case "text":
        case "email":
        case "tel":
        case "url":
        case "password":
          time += 4
          break
        case "textarea":
        case "richtext":
        case "markdown":
        case "code":
          time += 20
          break
        case "select":
        case "radio":
        case "checkbox":
          time += 3
          break
        case "date":
        case "time":
        case "datetime":
          time += 5
          break
        case "daterange":
        case "datetimerange":
          time += 8
          break
        case "location":
        case "address":
          time += 15
          break
        case "signature":
          time += 10
          break
        default:
          time += 3
      }

      // Add time for required fields (more careful input)
      if (field.required) time += 2

      // Add time for validation constraints
      if (field.pattern || field.minLength || field.maxLength || field.min || field.max) time += 2
    })

    return time
  }

  // Predict conversion rate (0-100%)
  const predictConversionRate = (): number => {
    if (!schema.fields.length) return 0

    // Base conversion rate
    let rate = 90

    // Decrease for number of fields (more fields = lower conversion)
    rate -= Math.min(schema.fields.length * 2, 30)

    // Decrease for required fields
    const requiredFields = schema.fields.filter((field) => field.required)
    rate -= requiredFields.length * 1.5

    // Decrease for complex field types
    const complexTypes = ["richtext", "markdown", "code", "location", "signature", "address"]
    schema.fields.forEach((field) => {
      if (complexTypes.includes(field.type)) rate -= 3
    })

    // Decrease for validation constraints
    schema.fields.forEach((field) => {
      if (field.pattern) rate -= 2
      if (field.minLength || field.maxLength) rate -= 1
      if (field.min || field.max) rate -= 1
    })

    return Math.max(Math.min(rate, 95), 20)
  }

  // Generate field type distribution
  const generateFieldTypeDistribution = () => {
    const distribution: Record<string, number> = {}

    schema.fields.forEach((field) => {
      if (distribution[field.type]) {
        distribution[field.type]++
      } else {
        distribution[field.type] = 1
      }
    })

    return distribution
  }

  // Generate validation analysis
  const generateValidationAnalysis = () => {
    const totalFields = schema.fields.length
    if (totalFields === 0) return { requiredPercentage: 0, validatedPercentage: 0 }

    const requiredFields = schema.fields.filter((field) => field.required).length
    const validatedFields = schema.fields.filter(
      (field) => field.pattern || field.minLength || field.maxLength || field.min || field.max || field.validateRange,
    ).length

    return {
      requiredPercentage: Math.round((requiredFields / totalFields) * 100),
      validatedPercentage: Math.round((validatedFields / totalFields) * 100),
    }
  }

  const handleGenerateMetrics = () => {
    setIsGenerating(true)
    // Simulate processing time
    setTimeout(() => {
      setIsGenerating(false)
    }, 800)
  }

  const handleExportMetrics = () => {
    // In a real app, this would generate a CSV or PDF report
    alert("In a real app, this would download a detailed metrics report")
  }

  const complexityScore = calculateComplexityScore()
  const completionTime = estimateCompletionTime()
  const conversionRate = predictConversionRate()
  const fieldDistribution = generateFieldTypeDistribution()
  const validationAnalysis = generateValidationAnalysis()

  // Format completion time for display
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} min${minutes !== 1 ? "s" : ""} ${remainingSeconds} sec${remainingSeconds !== 1 ? "s" : ""}`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Form Analytics</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleGenerateMetrics} disabled={isGenerating}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportMetrics}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fields">Field Analysis</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 mb-1">Complexity Score</div>
                    <div className="text-3xl font-bold">{complexityScore}/100</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {complexityScore < 30 ? "Simple" : complexityScore < 70 ? "Moderate" : "Complex"}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${complexityScore}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 mb-1">Est. Completion Time</div>
                    <div className="text-3xl font-bold">{formatTime(completionTime)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {completionTime < 30 ? "Quick" : completionTime < 90 ? "Average" : "Time-consuming"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 mb-1">Predicted Conversion</div>
                    <div className="text-3xl font-bold">{conversionRate}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {conversionRate < 40 ? "Low" : conversionRate < 70 ? "Average" : "High"}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className={`h-2.5 rounded-full ${
                          conversionRate < 40 ? "bg-red-500" : conversionRate < 70 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${conversionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium mb-4">Form Summary</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Fields</span>
                    <span className="font-medium">{schema.fields.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Required Fields</span>
                    <span className="font-medium">
                      {schema.fields.filter((f) => f.required).length}(
                      {schema.fields.length
                        ? Math.round((schema.fields.filter((f) => f.required).length / schema.fields.length) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Field Types</span>
                    <span className="font-medium">{Object.keys(fieldDistribution).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Advanced Fields</span>
                    <span className="font-medium">
                      {
                        schema.fields.filter((f) =>
                          [
                            "richtext",
                            "markdown",
                            "code",
                            "location",
                            "datetimerange",
                            "signature",
                            "address",
                          ].includes(f.type),
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium mb-4">Field Type Distribution</div>
                <div className="space-y-3">
                  {Object.entries(fieldDistribution).map(([type, count]) => (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{type}</span>
                        <span>
                          {count} ({Math.round((count / schema.fields.length) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / schema.fields.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium">Input Types</div>
                    <BarChart className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="h-[200px] flex items-end justify-around">
                    {/* Simulated chart - in a real app, use a proper chart library */}
                    {Object.entries(fieldDistribution)
                      .slice(0, 5)
                      .map(([type, count], index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="w-12 bg-blue-500 rounded-t-sm"
                            style={{ height: `${(count / Math.max(...Object.values(fieldDistribution))) * 150}px` }}
                          ></div>
                          <div className="text-xs mt-1 truncate w-12 text-center">{type}</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium">Field Complexity</div>
                    <PieChart className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex justify-center items-center h-[200px]">
                    {/* Simulated pie chart - in a real app, use a proper chart library */}
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
                      <div
                        className="absolute inset-0 rounded-full border-t-8 border-l-8 border-green-500"
                        style={{ clipPath: "polygon(0 0, 0% 100%, 100% 0)" }}
                      ></div>
                      <div
                        className="absolute inset-0 rounded-full border-r-8 border-b-8 border-yellow-500"
                        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
                      ></div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <div className="w-3 h-3 bg-blue-500"></div>
                        <div>Simple (40%)</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <div className="w-3 h-3 bg-green-500"></div>
                        <div>Moderate (35%)</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 bg-yellow-500"></div>
                        <div>Complex (25%)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 mb-1">Required Fields</div>
                    <div className="text-3xl font-bold">{validationAnalysis.requiredPercentage}%</div>
                    <div className="text-xs text-gray-500 mt-1">of total fields</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${validationAnalysis.requiredPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 mb-1">Validated Fields</div>
                    <div className="text-3xl font-bold">{validationAnalysis.validatedPercentage}%</div>
                    <div className="text-xs text-gray-500 mt-1">with validation rules</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${validationAnalysis.validatedPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium mb-4">Validation Types</div>
                <div className="space-y-3">
                  {[
                    { name: "Required", count: schema.fields.filter((f) => f.required).length },
                    { name: "Pattern/Regex", count: schema.fields.filter((f) => f.pattern).length },
                    { name: "Min/Max Length", count: schema.fields.filter((f) => f.minLength || f.maxLength).length },
                    { name: "Min/Max Value", count: schema.fields.filter((f) => f.min || f.max).length },
                    { name: "Date Range", count: schema.fields.filter((f) => f.validateRange).length },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${schema.fields.length ? (item.count / schema.fields.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium">Validation Coverage</div>
                  <LineChart className="h-4 w-4 text-gray-400" />
                </div>
                <div className="h-[200px] relative">
                  {/* Simulated line chart - in a real app, use a proper chart library */}
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
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                    <div>Text</div>
                    <div>Number</div>
                    <div>Date</div>
                    <div>Select</div>
                    <div>File</div>
                    <div>Custom</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                    <span>Required</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 mr-1"></div>
                    <span>Validation Rules</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
