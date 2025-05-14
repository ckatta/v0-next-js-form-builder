"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, Upload, Check, AlertTriangle } from "lucide-react"
import type { FormSchema } from "./form-builder"

interface JsonEditorProps {
  schema: FormSchema
  updateSchema: (schema: FormSchema) => void
}

export default function JsonEditor({ schema, updateSchema }: JsonEditorProps) {
  const [jsonValue, setJsonValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setJsonValue(JSON.stringify(schema, null, 2))
  }, [schema])

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonValue(e.target.value)
    setError(null)
  }

  const applyChanges = () => {
    try {
      const parsedJson = JSON.parse(jsonValue)

      // Basic validation
      if (!parsedJson.title || typeof parsedJson.title !== "string") {
        setError("JSON must include a title property of type string")
        return
      }

      if (!Array.isArray(parsedJson.fields)) {
        setError("JSON must include a fields property of type array")
        return
      }

      // Validate each field has required properties
      for (const field of parsedJson.fields) {
        if (!field.id || !field.type || !field.label) {
          setError("Each field must have id, type, and label properties")
          return
        }
      }

      updateSchema(parsedJson)
      setError(null)
    } catch (err) {
      setError("Invalid JSON format")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJson = () => {
    const blob = new Blob([jsonValue], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${schema.title.toLowerCase().replace(/\s+/g, "-")}-form-schema.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsedJson = JSON.parse(content)
        setJsonValue(JSON.stringify(parsedJson, null, 2))
      } catch (err) {
        setError("Invalid JSON file")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">JSON Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" onClick={downloadJson}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="relative">
            <Upload className="h-4 w-4 mr-2" />
            Upload
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-4">
          <Textarea value={jsonValue} onChange={handleJsonChange} className="font-mono text-sm min-h-[400px]" />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={applyChanges}>Apply Changes</Button>
      </div>
    </div>
  )
}
