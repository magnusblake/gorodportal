import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Городской портал для обращений граждан
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Удобная платформа для взаимодействия с городской администрацией. Оставляйте обращения, получайте ответы
                и следите за новостями города.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/appeals/new">
                <Button size="lg">Оставить обращение</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Узнать больше
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Городской портал"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              height="310"
              src="/placeholder.svg?height=620&width=1100"
              width="550"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

