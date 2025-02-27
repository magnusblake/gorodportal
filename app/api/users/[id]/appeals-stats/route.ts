import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/local-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const appeals = db.appeals.findAll().filter((appeal) => appeal.userId === params.id)

  const stats = {
    total: appeals.length,
    pending: appeals.filter((appeal) => appeal.status === "PENDING").length,
    inProgress: appeals.filter((appeal) => appeal.status === "IN_PROGRESS").length,
    answered: appeals.filter((appeal) => appeal.status === "ANSWERED").length,
    closed: appeals.filter((appeal) => appeal.status === "CLOSED").length,
    rejected: appeals.filter((appeal) => appeal.status === "REJECTED").length,
  }

  return NextResponse.json(stats)
}

