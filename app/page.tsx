"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FormBuilder from "@/components/form-builder"
import FormPreview from "@/components/form-preview"
import JsonEditor from "@/components/json-editor"

export default function Home() {
  const [formSchema, setFormSchema] = useState({
    title: "My Form",
    fields: [],
  })

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Next.js Form Builder</h1>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="preview">Form Preview</TabsTrigger>
          <TabsTrigger value="json">JSON Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <FormBuilder schema={formSchema} updateSchema={setFormSchema} />
        </TabsContent>

        <TabsContent value="preview">
          <FormPreview schema={formSchema} />
        </TabsContent>

        <TabsContent value="json">
          <JsonEditor schema={formSchema} updateSchema={setFormSchema} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
