import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NewAppealForm } from "@/components/appeals/new-appeal-form"
import { db } from "@/lib/db"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Новое обращение | Городской портал",
  description: "Создание нового обращения в Администрацию города",
}

export default async function NewAppealPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/appeals/new")
  }

  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Новое обращение</h1>
        <NewAppealForm categories={categories} userId={session.user.id} />
      </div>
    </div>
  )
}

