import { NextResponse } from "next/server"
import { db } from "@/lib/db"

const ITEMS_PER_PAGE = 9

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""
  const page = Number.parseInt(searchParams.get("page") || "1", 10)

  let news = db.news.findAll().filter((item) => item.published)

  news = news.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()),
  )

  const totalCount = news.length
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  news = news
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return NextResponse.json({ news, totalPages })
}

