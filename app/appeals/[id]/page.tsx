import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import type { Metadata } from "next"
import { AppealDetail } from "@/components/appeals/appeal-detail"
import { AppealResponse } from "@/components/appeals/appeal-response"

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const appeal = await db.appeal.findUnique({
    where: { id: params.id },
    select: { title: true },
  })

  if (!appeal) {
    return {
      title: "Обращение не найдено | Городской портал",
    }
  }

  return {
    title: `${appeal.title} | Городской портал`,
    description: "Детали обращения в Администрацию города",
  }
}

export default async function AppealPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/auth/signin?callbackUrl=/appeals/${params.id}`)
  }

  const appeal = await db.appeal.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      responses: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  if (!appeal) {
    notFound()
  }

  // Проверяем, имеет ли пользователь доступ к этому обращению
  const isOwner = appeal.user.id === session.user.id
  const isAdmin = session.user.role === "ADMIN"

  if (!isOwner && !isAdmin) {
    redirect("/appeals/my")
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <AppealDetail appeal={appeal} isAdmin={isAdmin} />

        {appeal.responses.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Ответы</h2>
            <div className="space-y-4">
              {appeal.responses.map((response) => (
                <div key={response.id} className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(response.createdAt).toLocaleString("ru-RU")}
                  </div>
                  <p>{response.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAdmin && appeal.status !== "CLOSED" && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Ответить на обращение</h2>
            <AppealResponse appealId={appeal.id} />
          </div>
        )}
      </div>
    </div>
  )
}

