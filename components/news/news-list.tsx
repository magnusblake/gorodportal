"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type NewsItem = {
  id: string
  title: string
  content: string
  image: string | null
  createdAt: string
}

interface NewsListProps {
  query: string
  page: number
  onTotalPagesChange: (totalPages: number) => void
}

export function NewsList({ query, page, onTotalPagesChange }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      const response = await fetch(`/api/news?query=${encodeURIComponent(query)}&page=${page}`)
      const data = await response.json()
      setNews(data.news)
      onTotalPagesChange(data.totalPages)
      setIsLoading(false)
    }

    fetchNews()
  }, [query, page, onTotalPagesChange])

  if (isLoading) {
    return <p className="text-center">Загрузка новостей...</p>
  }

  if (news.length === 0) {
    return <p className="text-center text-muted-foreground">Новости не найдены</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            {item.image && (
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="aspect-video w-full rounded-lg object-cover"
              />
            )}
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{formatDate(item.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-muted-foreground">{item.content}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/news/${item.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                Читать далее
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

