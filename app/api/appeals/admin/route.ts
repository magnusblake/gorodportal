import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/local-db"

const ITEMS_PER_PAGE = 10

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page")) || 1
  const query = searchParams.get("query") || ""
  const status = searchParams.get("status") || "all"
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  let appeals = db.appeals.findAll()

  // Применяем фильтры
  if (status !== "all") {
    appeals = appeals.filter((appeal) => appeal.status === status)
  }

  if (query) {
    const lowercaseQuery = query.toLowerCase()
    appeals = appeals.filter(
      (appeal) =>
        appeal.title.toLowerCase().includes(lowercaseQuery) || appeal.content.toLowerCase().includes(lowercaseQuery),
    )
  }

  // Сортировка
  appeals.sort((a, b) => {
    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      return sortOrder === "asc"
        ? new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime()
        : new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime()
    } else if (sortBy === "status") {
      return sortOrder === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
    }
    return 0
  })

  const totalAppeals = appeals.length
  const totalPages = Math.ceil(totalAppeals / ITEMS_PER_PAGE)

  appeals = appeals.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  appeals = appeals.map((appeal) => ({
    ...appeal,
    category: db.categories.findById(appeal.categoryId),
    user: db.users.findById(appeal.userId),
  }))

  return NextResponse.json({
    appeals,
    totalPages,
    currentPage: page,
    totalAppeals,
  })
}

