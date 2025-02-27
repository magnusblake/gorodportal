import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

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

  const where = {
    userId: userId || undefined,
    OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }],
  }

  const [appeals, totalCount] = await Promise.all([
    db.appeal.findMany({
      where,
      include: {
        category: true,
        responses: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    }),
    db.appeal.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return NextResponse.json({ appeals, totalPages })
}

