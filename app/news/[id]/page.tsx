import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = db.news.findUnique({
    where: { id: params.id },
  })

  if (!news) {
    return {
      title: "Новость не найдена | Городской портал",
    }
  }

  return {
    title: `${news.title} | Городской портал`,
    description: news.content.slice(0, 160),
  }
}

export default async function NewsItemPage({ params }: Props) {
  const news = db.news.findUnique({
    where: { id: params.id },
  })

  if (!news) {
    notFound()
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          {news.image && (
            <img
              src={news.image || "/placeholder.svg"}
              alt={news.title}
              className="aspect-video w-full rounded-lg object-cover mb-4"
            />
          )}
          <CardTitle className="text-3xl">{news.title}</CardTitle>
          <CardDescription>{formatDate(news.createdAt.toString())}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {news.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

