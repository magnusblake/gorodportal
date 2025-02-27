import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/local-db"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const fromDate = searchParams.get("from")
  const toDate = searchParams.get("to")

  const appeals = db.appeals.findAll()
  const categories = db.categories.findAll()

  const filteredAppeals = appeals.filter((appeal) => {
    const appealDate = new Date(appeal.createdAt)
    return (!fromDate || appealDate >= new Date(fromDate)) && (!toDate || appealDate <= new Date(toDate))
  })

  const stats = categories.map((category) => {
    const count = filteredAppeals.filter((appeal) => appeal.categoryId === category.id).length
    return {
      name: category.name,
      count: count,
    }
  })

  return NextResponse.json(stats)
}

