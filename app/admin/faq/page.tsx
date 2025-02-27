import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { AdminFAQList } from "@/components/admin/admin-faq-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Управление FAQ | Городской портал",
  description: "Административная панель для управления часто задаваемыми вопросами",
}

export default async function AdminFAQPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const faqs = await db.fAQ.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  })

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление FAQ</h1>
        <Link href="/admin/faq/new">
          <Button>Добавить вопрос</Button>
        </Link>
      </div>
      <AdminFAQList faqs={faqs} />
    </div>
  )
}

