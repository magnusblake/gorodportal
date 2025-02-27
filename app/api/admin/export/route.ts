import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/local-db"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const exportData = {
    users: db.users.findAll().map(({ password, ...user }) => user), // Исключаем пароли из экспорта
    appeals: db.appeals.findAll(),
    news: db.news.findAll(),
    faq: db.faq.findAll(),
    categories: db.categories.findAll(),
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=city_portal_data_export.json",
    },
  })
}

