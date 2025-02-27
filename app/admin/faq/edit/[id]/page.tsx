import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import type { Metadata } from "next"
import { FAQForm } from "@/components/admin/faq-form"

export const metadata: Metadata = {
  title: "Редактирование вопроса FAQ | Городской портал",
  description: "Редактирование существующего вопроса в FAQ Городского портала",
}

type Props = {
  params: {
    id: string
  }
}

export default async function EditFAQPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const faq = await db.fAQ.findUnique({
    where: { id: params.id },
  })

  if (!faq) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Редактирование вопроса FAQ</h1>
      <FAQForm faq={faq} />
    </div>
  )
}

