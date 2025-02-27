import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

// Временные данные для новостей
const newsData = [
  {
    id: 1,
    title: "Открытие нового парка в центре города",
    description:
      "В эту субботу состоится торжественное открытие нового городского парка с фонтанами и детскими площадками.",
    date: "2023-06-15",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Ремонт дорог на улице Ленина",
    description: "С 20 июня начнутся работы по ремонту дорожного покрытия на улице Ленина. Движение будет ограничено.",
    date: "2023-06-12",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Городской фестиваль искусств",
    description:
      "С 1 по 5 июля в городе пройдет ежегодный фестиваль искусств с участием местных и приглашенных артистов.",
    date: "2023-06-10",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function NewsSection() {
  return (
    <section className="py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Новости города</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Будьте в курсе последних событий и новостей нашего города
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {newsData.map((news) => (
            <Card key={news.id}>
              <CardHeader className="pb-2">
                <img
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  className="aspect-video w-full rounded-lg object-cover"
                />
                <CardTitle>{news.title}</CardTitle>
                <CardDescription>{formatDate(news.date)}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">{news.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/news/${news.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Читать далее
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/news">
            <Button variant="outline">Все новости</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

