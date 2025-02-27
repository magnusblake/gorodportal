import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/local-db"
import { createNotification } from "@/lib/actions"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, content } = await request.json()

  const users = db.users.findAll()

  for (const user of users) {
    await createNotification({
      type: "NEWS_UPDATE",
      content: `${title}: ${content}`,
      userId: user.id,
    })
  }

  return NextResponse.json({ message: "Notifications sent successfully" })
}

