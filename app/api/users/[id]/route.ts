import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/local-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = db.users.findById(params.id)

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { password, ...userWithoutPassword } = user

  return NextResponse.json(userWithoutPassword)
}

