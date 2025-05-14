"use client"

import { useState } from "react"
import { PlusCircle, Trash2, GripVertical, Settings, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FieldSelector from "./field-selector"
import AdvancedFieldConfig from "./advanced-field-config"

export interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
  rows?: number
  min?: string
  max?: string
  step?: string
  pattern?: string
  minLength?: string
  maxLength?: string
  accept?: string
  className?: string
  value?: string
  defaultValue?: string | number
  language?: string
  captchaType?: string
  validateRange?: boolean
  minDuration?: string
  maxDuration?: string
  showTimezone?: boolean
  showDuration?: boolean
  timezone?: string
  latitude?: number
  longitude?: number
  zoom?: number
  dataSource?: string
}

export interface FormSchema {
  title: string
  fields: FormField[]
}

interface FormBuilderProps {
  schema: FormSchema
  updateSchema: (schema: FormSchema) => void
}

export default function FormBuilder({ schema, updateSchema }: FormBuilderProps) {
  const [showFieldSelector, setShowFieldSelector] = useState(false)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const addField = (type: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: getDefaultLabelForType(type),
    }

    // Add default options for select, radio, checkbox
    if (["select", "radio", "checkbox", "multiselect"].includes(type)) {
      newField.options = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ]
    }

    const updatedSchema = {
      ...schema,
      fields: [...schema.fields, newField],
    }

    updateSchema(updatedSchema)
    setShowFieldSelector(false)
    setSelectedFieldId(newField.id)
  }

  const getDefaultLabelForType = (type: string): string => {
    const typeLabels: Record<string, string> = {
      text: "Text Input",
      textarea: "Text Area",
      email: "Email Address",
      password: "Password",
      number: "Number",
      select: "Select Option",
      checkbox: "Checkbox Group",
      radio: "Radio Group",
      date: "Date",
      time: "Time",
      datetime: "Date and Time",
      tel: "Phone Number",
      url: "Website URL",
      file: "File Upload",
      hidden: "Hidden Field",
      range: "Range Slider",
      color: "Color Picker",
      rating: "Rating",
      richtext: "Rich Text Editor",
      markdown: "Markdown Editor",
      code: "Code Editor",
      image: "Image Upload",
      signature: "Signature",
      address: "Address",
      location: "Location",
      captcha: "CAPTCHA",
      multiselect: "Multi-Select",
      daterange: "Date Range",
      datetimerange: "Date & Time Range",
      barchart: "Bar Chart",
      linechart: "Line Chart",
      piechart: "Pie Chart",
      datatable: "Data Table",
      gauge: "Gauge Meter",
      metrics: "Metrics Dashboard",
    }

    return typeLabels[type] || "Field"
  }

  const removeField = (fieldId: string) => {
    const updatedSchema = {
      ...schema,
      fields: schema.fields.filter((field) => field.id !== fieldId),
    }
    updateSchema(updatedSchema)
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null)
    }
  }

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = schema.fields.find((field) => field.id === fieldId)
    if (!fieldToDuplicate) return

    const duplicatedField = {
      ...fieldToDuplicate,
      id: `field-${Date.now()}`,
      label: `${fieldToDuplicate.label} (Copy)`,
    }

    const updatedSchema = {
      ...schema,
      fields: [...schema.fields, duplicatedField],
    }
    updateSchema(updatedSchema)
  }

  const updateField = (fieldId: string, updatedField: Partial<FormField>) => {
    const updatedSchema = {
      ...schema,
      fields: schema.fields.map((field) => (field.id === fieldId ? { ...field, ...updatedField } : field)),
    }
    updateSchema(updatedSchema)
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= schema.fields.length) return

    const updatedFields = [...schema.fields]
    const [movedField] = updatedFields.splice(fromIndex, 1)
    updatedFields.splice(toIndex, 0, movedField)

    const updatedSchema = {
      ...schema,
      fields: updatedFields,
    }
    updateSchema(updatedSchema)
  }

  const selectedField = schema.fields.find((field) => field.id === selectedFieldId)

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={schema.title}
              onChange={(e) => updateSchema({ ...schema, title: e.target.value })}
              className="max-w-md"
            />
          </div>
          <Button onClick={() => setShowFieldSelector(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>

        {showFieldSelector && (
          <Card>
            <CardContent className="p-4">
              <FieldSelector onSelect={addField} onClose={() => setShowFieldSelector(false)} />
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {schema.fields.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">No fields added yet. Click "Add Field" to start building your form.</p>
            </div>
          ) : (
            schema.fields.map((field, index) => (
              <Card
                key={field.id}
                className={`${selectedFieldId === field.id ? "border-blue-500" : ""}`}
                onClick={() => setSelectedFieldId(field.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="cursor-move p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Drag to reorder"
                      >
                        <GripVertical className="h-5 w-5" />
                      </button>
                      <div className="ml-2">
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-gray-500 capitalize">{field.type}</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFieldId(field.id)}
                        aria-label="Configure field"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateField(field.id)}
                        aria-label="Duplicate field"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeField(field.id)} aria-label="Remove field">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div>
        <Card className="sticky top-4">
          <CardContent className="p-4">
            {selectedField ? (
              <div>
                <h3 className="text-lg font-medium mb-4">Field Configuration</h3>
                <AdvancedFieldConfig field={selectedField} updateField={updateField} />
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-gray-500">Select a field to configure its properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
