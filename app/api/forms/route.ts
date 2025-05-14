import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

// Create forms table if it doesn't exist
async function ensureTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS forms (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      schema JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `
}

// GET /api/forms - Get all forms
export async function GET() {
  try {
    await ensureTableExists()

    const forms = await sql`
      SELECT id, title, schema, created_at as "createdAt", updated_at as "updatedAt"
      FROM forms
      ORDER BY updated_at DESC
    `

    // Transform the data to match our FormSchema interface
    const formattedForms = forms.map((form) => ({
      id: form.id,
      title: form.title,
      ...form.schema,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    }))

    return NextResponse.json(formattedForms)
  } catch (error) {
    console.error("Error fetching forms:", error)
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
  }
}

// POST /api/forms - Create a new form
export async function POST(request: Request) {
  try {
    await ensureTableExists()

    const body = await request.json()
    const { title, fields } = body

    if (!title || !fields) {
      return NextResponse.json({ error: "Title and fields are required" }, { status: 400 })
    }

    const id = uuidv4()
    const now = new Date().toISOString()

    // Store the form schema
    const schema = { fields }

    await sql`
      INSERT INTO forms (id, title, schema, created_at, updated_at)
      VALUES (${id}, ${title}, ${JSON.stringify(schema)}, ${now}, ${now})
    `

    return NextResponse.json(
      {
        id,
        title,
        fields,
        createdAt: now,
        updatedAt: now,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 })
  }
}
