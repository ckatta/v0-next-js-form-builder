import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET /api/forms/[id] - Get a specific form
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [form] = await sql`
      SELECT id, title, schema, created_at as "createdAt", updated_at as "updatedAt"
      FROM forms
      WHERE id = ${id}
    `

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Transform the data to match our FormSchema interface
    const formattedForm = {
      id: form.id,
      title: form.title,
      ...form.schema,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    }

    return NextResponse.json(formattedForm)
  } catch (error) {
    console.error("Error fetching form:", error)
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 })
  }
}

// PUT /api/forms/[id] - Update a form
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, fields } = body

    if (!title || !fields) {
      return NextResponse.json({ error: "Title and fields are required" }, { status: 400 })
    }

    const now = new Date().toISOString()

    // Store the form schema
    const schema = { fields }

    const [form] = await sql`
      UPDATE forms
      SET title = ${title}, schema = ${JSON.stringify(schema)}, updated_at = ${now}
      WHERE id = ${id}
      RETURNING id, title, schema, created_at as "createdAt", updated_at as "updatedAt"
    `

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Transform the data to match our FormSchema interface
    const formattedForm = {
      id: form.id,
      title: form.title,
      ...form.schema,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    }

    return NextResponse.json(formattedForm)
  } catch (error) {
    console.error("Error updating form:", error)
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 })
  }
}

// DELETE /api/forms/[id] - Delete a form
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [form] = await sql`
      DELETE FROM forms
      WHERE id = ${id}
      RETURNING id
    `

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Form deleted successfully" })
  } catch (error) {
    console.error("Error deleting form:", error)
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 })
  }
}
