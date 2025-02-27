import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Городской портал</h3>
            <p className="mt-2 text-sm text-muted-foreground">Платформа для обращений граждан в Администрацию города</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Ссылки</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground">
                  Новости
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  О портале
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Контакты</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="text-muted-foreground">Адрес: ул. Центральная, 1</li>
              <li className="text-muted-foreground">Телефон: +7 (123) 456-78-90</li>
              <li className="text-muted-foreground">Email: info@cityportal.ru</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Городской портал. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}

