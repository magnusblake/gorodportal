import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/local-db"

const ITEMS_PER_PAGE = 10

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""
  const userId = searchParams.get("userId") || ""
  const page = Number.parseInt(searchParams.get("page") || "1", 10)

  let appeals = db.appeals.findAll()

  if (userId) {
    appeals = appeals.filter((appeal) => appeal.userId === userId)
  }

  appeals = appeals.filter(
    (appeal) =>
      appeal.title.toLowerCase().includes(query.toLowerCase()) ||
      appeal.content.toLowerCase().includes(query.toLowerCase()),
  )

  const totalCount = appeals.length
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  appeals = appeals
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  appeals = appeals.map((appeal) => ({
    ...appeal,
    category: db.categories.findById(appeal.categoryId),
    responses: db
      .findAll("appealResponses")
      .filter((response) => response.appealId === appeal.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  }))

  return NextResponse.json({ appeals, totalPages })
}

