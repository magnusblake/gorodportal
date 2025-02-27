import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const stats = await db.appeal.groupBy({
    by: ["status"],
    where: { userId: params.id },
    _count: true,
  })

  const total = stats.reduce((acc, curr) => acc + curr._count, 0)

  const formattedStats = {
    total,
    pending: 0,
    inProgress: 0,
    answered: 0,
    closed: 0,
    rejected: 0,
  }

  stats.forEach((stat) => {
    switch (stat.status) {
      case "PENDING":
        formattedStats.pending = stat._count
        break
      case "IN_PROGRESS":
        formattedStats.inProgress = stat._count
        break
      case "ANSWERED":
        formattedStats.answered = stat._count
        break
      case "CLOSED":
        formattedStats.closed = stat._count
        break
      case "REJECTED":
        formattedStats.rejected = stat._count
        break
    }
  })

  return NextResponse.json(formattedStats)
}

