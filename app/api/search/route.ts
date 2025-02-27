import { NextResponse } from "next/server"
import { db } from "@/lib/local-db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const news = db.news
    .findAll()
    .filter(
      (item) =>
        item.published &&
        (item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase())),
    )
    .slice(0, 5)

  const appeals = db.appeals
    .findAll()
    .filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 5)

  const faqs = db.faq
    .findAll()
    .filter(
      (item) =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 5)

  const results = [
    ...news.map((item) => ({
      type: "Новость",
      id: item.id,
      title: item.title,
      excerpt: item.content.slice(0, 150) + "...",
      url: `/news/${item.id}`,
      date: item.createdAt,
    })),
    ...appeals.map((item) => ({
      type: "Обращение",
      id: item.id,
      title: item.title,
      excerpt: item.content.slice(0, 150) + "...",
      url: `/appeals/${item.id}`,
      date: item.createdAt,
      status: item.status,
    })),
    ...faqs.map((item) => ({
      type: "FAQ",
      id: item.id,
      title: item.question,
      excerpt: item.answer.slice(0, 150) + "...",
      url: `/faq#${item.id}`,
      category: item.category,
    })),
  ].sort((a, b) => (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0))

  return NextResponse.json(results)
}

