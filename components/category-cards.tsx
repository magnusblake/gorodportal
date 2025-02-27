import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RouteIcon as Road, Home, Landmark, FileQuestion } from "lucide-react"

export function CategoryCards() {
  return (
    <section className="py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Категории обращений</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Выберите категорию для вашего обращения
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <Road className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Дорожные обращения</CardTitle>
              <CardDescription>Вопросы по состоянию дорог, тротуаров, пешеходных переходов</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Сообщите о ямах, неисправных светофорах, отсутствии разметки и других проблемах дорожной инфраструктуры.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/appeals/category/roads" className="w-full">
                <Button className="w-full">Перейти</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Home className="h-12 w-12 text-primary mb-2" />
              <CardTitle>ЖКХ</CardTitle>
              <CardDescription>Вопросы жилищно-коммунального хозяйства</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Проблемы с отоплением, водоснабжением, электричеством, состоянием подъездов и придомовых территорий.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/appeals/category/housing" className="w-full">
                <Button className="w-full">Перейти</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Landmark className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Благоустройство</CardTitle>
              <CardDescription>Вопросы благоустройства города</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Озеленение, парки, скверы, детские площадки, уличное освещение и другие вопросы городской среды.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/appeals/category/improvement" className="w-full">
                <Button className="w-full">Перейти</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <FileQuestion className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Другое</CardTitle>
              <CardDescription>Прочие обращения</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Вопросы, не относящиеся к другим категориям: социальная сфера, образование, культура и другие.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/appeals/category/other" className="w-full">
                <Button className="w-full">Перейти</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}

