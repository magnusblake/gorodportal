import { SignUpForm } from "@/components/auth/sign-up-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Регистрация | Городской портал",
  description: "Создайте аккаунт на Городском портале",
}

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Создание аккаунта</h1>
          <p className="text-sm text-muted-foreground">Введите свои данные для регистрации</p>
        </div>
        <SignUpForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <a href="/auth/signin" className="underline underline-offset-4 hover:text-primary">
            Войти
          </a>
        </p>
      </div>
    </div>
  )
}

