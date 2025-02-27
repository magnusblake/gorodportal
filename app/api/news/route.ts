import { NextResponse } from "next/server"
import { db } from "@/lib/db"

const ITEMS_PER_PAGE = 9

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""
  const page = Number.parseInt(searchParams.get("page") || "1", 10)

  const where = {
    published: true,
    OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }],
  }

  const [news, totalCount] = await Promise.all([
    db.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    }),
    db.news.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return NextResponse.json({ news, totalPages })
}

