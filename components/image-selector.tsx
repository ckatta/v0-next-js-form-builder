"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageSelectorProps {
  id: string
  required?: boolean
  onChange?: (file: File | null, preview: string | null) => void
  maxSize?: number // in MB
  accept?: string
}

export default function ImageSelector({
  id,
  required = false,
  onChange,
  maxSize = 5, // Default 5MB
  accept = "image/*",
}: ImageSelectorProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    processFile(file)
  }

  const processFile = (file: File | undefined) => {
    if (!file) {
      setPreview(null)
      setError(null)
      if (onChange) onChange(null, null)
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Image size should be less than ${maxSize}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      setError(null)
      if (onChange) onChange(file, result)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    processFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (onChange) onChange(null, null)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        required={required}
        className="hidden"
        onChange={handleFileChange}
      />

      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Drag and drop an image, or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, GIF, WebP. Max size: {maxSize}MB</p>
        </div>
      ) : (
        <div className="relative border rounded-md overflow-hidden">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto max-h-[300px] object-contain bg-gray-50"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">{preview ? "Image selected" : "No image selected"}</div>
        <Button type="button" variant="outline" size="sm" onClick={handleClick} className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          {preview ? "Change Image" : "Select Image"}
        </Button>
      </div>
    </div>
  )
}
