import { NewsSection } from "@/components/news-section"
import { CategoryCards } from "@/components/category-cards"
import { VisitorCounter } from "@/components/visitor-counter"
import { HeroSection } from "@/components/hero-section"
import { incrementVisitorCount } from "@/lib/actions"
import { NewsList } from "@/components/news/news-list"
import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  // Увеличиваем счетчик посещений
  await incrementVisitorCount()

  const latestNews = await db.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <CategoryCards />
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Последние новости</h2>
          <NewsList news={latestNews} />
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

