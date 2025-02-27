import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const news = await db.news.findMany({
    where: {
      OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }],
      published: true,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    take: 5,
  })

  const appeals = await db.appeal.findMany({
    where: {
      OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }],
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      status: true,
    },
    take: 5,
  })

  const faqs = await db.fAQ.findMany({
    where: {
      OR: [
        { question: { contains: query, mode: "insensitive" } },
        { answer: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      question: true,
      answer: true,
      category: true,
    },
    take: 5,
  })

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
  ].sort((a, b) => (b.date ? b.date.getTime() : 0) - (a.date ? a.date.getTime() : 0))

  return NextResponse.json(results)
}

