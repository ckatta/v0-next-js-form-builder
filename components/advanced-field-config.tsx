"use client"

import { useState } from "react"
import type { FormField } from "./form-builder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { BarChart, LineChart, PieChart } from "lucide-react"

interface AdvancedFieldConfigProps {
  field: FormField
  updateField: (fieldId: string, updatedField: Partial<FormField>) => void
}

export default function AdvancedFieldConfig({ field, updateField }: AdvancedFieldConfigProps) {
  const [activeTab, setActiveTab] = useState("basic")

  if (!field) return null

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {/* Basic settings that apply to most field types */}
          <div>
            <Label htmlFor={`${field.id}-label`}>Label</Label>
            <Input
              id={`${field.id}-label`}
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
            />
          </div>

          {field.type !== "checkbox" &&
            field.type !== "hidden" &&
            field.type !== "rating" &&
            !field.type.includes("chart") &&
            field.type !== "gauge" &&
            field.type !== "metrics" && (
              <div>
                <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
                <Input
                  id={`${field.id}-placeholder`}
                  value={field.placeholder || ""}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                />
              </div>
            )}

          {field.type !== "barchart" &&
            field.type !== "linechart" &&
            field.type !== "piechart" &&
            field.type !== "datatable" &&
            field.type !== "gauge" &&
            field.type !== "metrics" && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${field.id}-required`}
                  checked={field.required || false}
                  onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                />
                <Label htmlFor={`${field.id}-required`}>Required field</Label>
              </div>
            )}

          {(field.type === "text" ||
            field.type === "textarea" ||
            field.type === "richtext" ||
            field.type === "markdown" ||
            field.type === "code") && (
            <div>
              <Label htmlFor={`${field.id}-rows`}>Rows (height)</Label>
              <Input
                id={`${field.id}-rows`}
                type="number"
                min="1"
                max="20"
                value={field.rows || 3}
                onChange={(e) => updateField(field.id, { rows: Number.parseInt(e.target.value) })}
              />
            </div>
          )}

          {(field.type === "select" ||
            field.type === "radio" ||
            field.type === "checkbox" ||
            field.type === "multiselect") && (
            <div>
              <Label className="block mb-2">Options</Label>
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])]
                      newOptions[index] = {
                        ...newOptions[index],
                        label: e.target.value,
                        value: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      }
                      updateField(field.id, { options: newOptions })
                    }}
                    placeholder="Option label"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== index)
                      updateField(field.id, { options: newOptions })
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [
                    ...(field.options || []),
                    {
                      label: `Option ${(field.options?.length || 0) + 1}`,
                      value: `option${(field.options?.length || 0) + 1}`,
                    },
                  ]
                  updateField(field.id, { options: newOptions })
                }}
              >
                Add Option
              </Button>
            </div>
          )}

          {field.type === "location" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor={`${field.id}-latitude`}>Default Latitude</Label>
                <Input
                  id={`${field.id}-latitude`}
                  type="number"
                  step="0.000001"
                  value={field.latitude || 40.7128}
                  onChange={(e) => updateField(field.id, { latitude: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor={`${field.id}-longitude`}>Default Longitude</Label>
                <Input
                  id={`${field.id}-longitude`}
                  type="number"
                  step="0.000001"
                  value={field.longitude || -74.006}
                  onChange={(e) => updateField(field.id, { longitude: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor={`${field.id}-zoom`}>Default Zoom Level</Label>
                <Input
                  id={`${field.id}-zoom`}
                  type="number"
                  min="1"
                  max="20"
                  value={field.zoom || 13}
                  onChange={(e) => updateField(field.id, { zoom: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          {field.type === "datetimerange" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${field.id}-show-timezone`}
                  checked={field.showTimezone || false}
                  onCheckedChange={(checked) => updateField(field.id, { showTimezone: checked })}
                />
                <Label htmlFor={`${field.id}-show-timezone`}>Show timezone selector</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${field.id}-show-duration`}
                  checked={field.showDuration || false}
                  onCheckedChange={(checked) => updateField(field.id, { showDuration: checked })}
                />
                <Label htmlFor={`${field.id}-show-duration`}>Show duration calculation</Label>
              </div>
            </div>
          )}

          {(field.type === "barchart" || field.type === "linechart" || field.type === "piechart") && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <Label>Chart Type</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={field.type === "barchart" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => updateField(field.id, { type: "barchart" })}
                    >
                      <BarChart className="h-4 w-4" />
                      Bar
                    </Button>
                    <Button
                      type="button"
                      variant={field.type === "linechart" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => updateField(field.id, { type: "linechart" })}
                    >
                      <LineChart className="h-4 w-4" />
                      Line
                    </Button>
                    <Button
                      type="button"
                      variant={field.type === "piechart" ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => updateField(field.id, { type: "piechart" })}
                    >
                      <PieChart className="h-4 w-4" />
                      Pie
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor={`${field.id}-datasource`}>Data Source</Label>
                <Select
                  value={field.dataSource || "sample"}
                  onValueChange={(value) => updateField(field.id, { dataSource: value })}
                >
                  <SelectTrigger id={`${field.id}-datasource`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sample">Sample Data</SelectItem>
                    <SelectItem value="api">API Endpoint</SelectItem>
                    <SelectItem value="form">Form Responses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {field.dataSource === "api" && (
                <div>
                  <Label htmlFor={`${field.id}-apiurl`}>API URL</Label>
                  <Input
                    id={`${field.id}-apiurl`}
                    placeholder="https://api.example.com/data"
                    value={field.value || ""}
                    onChange={(e) => updateField(field.id, { value: e.target.value })}
                  />
                </div>
              )}
              <div>
                <Label htmlFor={`${field.id}-chartdata`}>Chart Data (JSON)</Label>
                <Textarea
                  id={`${field.id}-chartdata`}
                  placeholder={`[
  { "name": "Category A", "value": 400 },
  { "name": "Category B", "value": 300 },
  { "name": "Category C", "value": 200 }
]`}
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          )}

          {field.type === "datatable" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor={`${field.id}-datasource`}>Data Source</Label>
                <Select
                  value={field.dataSource || "sample"}
                  onValueChange={(value) => updateField(field.id, { dataSource: value })}
                >
                  <SelectTrigger id={`${field.id}-datasource`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sample">Sample Data</SelectItem>
                    <SelectItem value="api">API Endpoint</SelectItem>
                    <SelectItem value="form">Form Responses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {field.dataSource === "api" && (
                <div>
                  <Label htmlFor={`${field.id}-apiurl`}>API URL</Label>
                  <Input
                    id={`${field.id}-apiurl`}
                    placeholder="https://api.example.com/data"
                    value={field.value || ""}
                    onChange={(e) => updateField(field.id, { value: e.target.value })}
                  />
                </div>
              )}
              <div>
                <Label htmlFor={`${field.id}-columns`}>Table Columns (comma separated)</Label>
                <Input
                  id={`${field.id}-columns`}
                  placeholder="Name, Category, Value, Status"
                  value={field.value || ""}
                  onChange={(e) => updateField(field.id, { value: e.target.value })}
                />
              </div>
            </div>
          )}

          {field.type === "gauge" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor={`${field.id}-min`}>Min Value</Label>
                  <Input
                    id={`${field.id}-min`}
                    type="number"
                    value={field.min || "0"}
                    onChange={(e) => updateField(field.id, { min: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field.id}-max`}>Max Value</Label>
                  <Input
                    id={`${field.id}-max`}
                    type="number"
                    value={field.max || "100"}
                    onChange={(e) => updateField(field.id, { max: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field.id}-value`}>Current Value</Label>
                  <Input
                    id={`${field.id}-value`}
                    type="number"
                    value={field.defaultValue || "65"}
                    onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {field.type === "metrics" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor={`${field.id}-datasource`}>Data Source</Label>
                <Select
                  value={field.dataSource || "sample"}
                  onValueChange={(value) => updateField(field.id, { dataSource: value })}
                >
                  <SelectTrigger id={`${field.id}-datasource`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sample">Sample Data</SelectItem>
                    <SelectItem value="api">API Endpoint</SelectItem>
                    <SelectItem value="form">Form Responses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {field.dataSource === "api" && (
                <div>
                  <Label htmlFor={`${field.id}-apiurl`}>API URL</Label>
                  <Input
                    id={`${field.id}-apiurl`}
                    placeholder="https://api.example.com/metrics"
                    value={field.value || ""}
                    onChange={(e) => updateField(field.id, { value: e.target.value })}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${field.id}-realtime`}
                  checked={field.required || false}
                  onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                />
                <Label htmlFor={`${field.id}-realtime`}>Real-time updates</Label>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          {/* Validation settings */}
          {(field.type === "text" ||
            field.type === "email" ||
            field.type === "password" ||
            field.type === "tel" ||
            field.type === "url") && (
            <div>
              <Label htmlFor={`${field.id}-pattern`}>Validation Pattern (RegEx)</Label>
              <Input
                id={`${field.id}-pattern`}
                placeholder="e.g. [A-Za-z0-9]+"
                value={field.pattern || ""}
                onChange={(e) => updateField(field.id, { pattern: e.target.value })}
              />
            </div>
          )}

          {(field.type === "number" || field.type === "range") && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor={`${field.id}-min`}>Min Value</Label>
                  <Input
                    id={`${field.id}-min`}
                    type="number"
                    value={field.min || ""}
                    onChange={(e) => updateField(field.id, { min: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field.id}-max`}>Max Value</Label>
                  <Input
                    id={`${field.id}-max`}
                    type="number"
                    value={field.max || ""}
                    onChange={(e) => updateField(field.id, { max: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field.id}-step`}>Step</Label>
                  <Input
                    id={`${field.id}-step`}
                    type="number"
                    value={field.step || ""}
                    onChange={(e) => updateField(field.id, { step: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {(field.type === "text" ||
            field.type === "textarea" ||
            field.type === "richtext" ||
            field.type === "markdown" ||
            field.type === "code") && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`${field.id}-minlength`}>Min Length</Label>
                <Input
                  id={`${field.id}-minlength`}
                  type="number"
                  value={field.minLength || ""}
                  onChange={(e) => updateField(field.id, { minLength: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor={`${field.id}-maxlength`}>Max Length</Label>
                <Input
                  id={`${field.id}-maxlength`}
                  type="number"
                  value={field.maxLength || ""}
                  onChange={(e) => updateField(field.id, { maxLength: e.target.value })}
                />
              </div>
            </div>
          )}

          {field.type === "file" && (
            <div>
              <Label htmlFor={`${field.id}-accept`}>Accepted File Types</Label>
              <Input
                id={`${field.id}-accept`}
                placeholder="e.g. .pdf,.doc,.docx"
                value={field.accept || ""}
                onChange={(e) => updateField(field.id, { accept: e.target.value })}
              />
            </div>
          )}

          {field.type === "datetimerange" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${field.id}-validate-range`}
                  checked={field.validateRange || false}
                  onCheckedChange={(checked) => updateField(field.id, { validateRange: checked })}
                />
                <Label htmlFor={`${field.id}-validate-range`}>Validate end date is after start date</Label>
              </div>
              <div>
                <Label htmlFor={`${field.id}-min-duration`}>Minimum Duration (minutes)</Label>
                <Input
                  id={`${field.id}-min-duration`}
                  type="number"
                  min="0"
                  placeholder="e.g. 30"
                  value={field.minDuration || ""}
                  onChange={(e) => updateField(field.id, { minDuration: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor={`${field.id}-max-duration`}>Maximum Duration (minutes)</Label>
                <Input
                  id={`${field.id}-max-duration`}
                  type="number"
                  min="0"
                  placeholder="e.g. 120"
                  value={field.maxDuration || ""}
                  onChange={(e) => updateField(field.id, { maxDuration: e.target.value })}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {/* Advanced settings */}
          {field.type !== "barchart" &&
            field.type !== "linechart" &&
            field.type !== "piechart" &&
            field.type !== "datatable" &&
            field.type !== "metrics" && (
              <div>
                <Label htmlFor={`${field.id}-default`}>Default Value</Label>
                <Input
                  id={`${field.id}-default`}
                  value={
                    typeof field.defaultValue === "string" || typeof field.defaultValue === "number"
                      ? field.defaultValue.toString()
                      : ""
                  }
                  onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
                />
              </div>
            )}

          <div>
            <Label htmlFor={`${field.id}-class`}>CSS Class</Label>
            <Input
              id={`${field.id}-class`}
              placeholder="Custom CSS classes"
              value={field.className || ""}
              onChange={(e) => updateField(field.id, { className: e.target.value })}
            />
          </div>

          {field.type === "hidden" && (
            <div>
              <Label htmlFor={`${field.id}-value`}>Hidden Value</Label>
              <Input
                id={`${field.id}-value`}
                value={field.value || ""}
                onChange={(e) => updateField(field.id, { value: e.target.value })}
              />
            </div>
          )}

          {field.type === "captcha" && (
            <div>
              <Label htmlFor={`${field.id}-captchatype`}>CAPTCHA Type</Label>
              <Select
                value={field.captchaType || "simple"}
                onValueChange={(value) => updateField(field.id, { captchaType: value })}
              >
                <SelectTrigger id={`${field.id}-captchatype`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple CAPTCHA</SelectItem>
                  <SelectItem value="recaptcha">reCAPTCHA</SelectItem>
                  <SelectItem value="hcaptcha">hCAPTCHA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {field.type === "code" && (
            <div>
              <Label htmlFor={`${field.id}-language`}>Programming Language</Label>
              <Select
                value={field.language || "javascript"}
                onValueChange={(value) => updateField(field.id, { language: value })}
              >
                <SelectTrigger id={`${field.id}-language`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {field.type === "datetimerange" && (
            <div>
              <Label htmlFor={`${field.id}-timezone`}>Default Timezone</Label>
              <Select
                value={field.timezone || "local"}
                onValueChange={(value) => updateField(field.id, { timezone: value })}
              >
                <SelectTrigger id={`${field.id}-timezone`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Browser Local Time</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (EST/EDT)</SelectItem>
                  <SelectItem value="cst">Central Time (CST/CDT)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MST/MDT)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST/PDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
