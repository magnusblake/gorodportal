import { Suspense } from "react"
import { NewsSection } from "@/components/news-section"
import { CategoryCards } from "@/components/category-cards"
import { VisitorCounter } from "@/components/visitor-counter"
import { HeroSection } from "@/components/hero-section"
import { NewsList } from "@/components/news/news-list"
import { db } from "@/lib/local-db"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  // Увеличиваем счетчик посещений
  await db.visitorCounter.increment()

  const latestNews = db
    .findAll("news")
    .filter((news: any) => news.published)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <CategoryCards />
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Последние новости</h2>
          <Suspense fallback={<div>Загрузка новостей...</div>}>
            <NewsList news={latestNews} />
          </Suspense>
          <div className="mt-8 text-center">
            <Link href="/news">
              <Button variant="outline">Все новости</Button>
            </Link>
          </div>
        </div>
      </section>
      <NewsSection />
      <VisitorCounter />
    </div>
  )
}

