import { SignInForm } from "@/components/auth/sign-in-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Вход | Городской портал",
  description: "Войдите в свой аккаунт на Городском портале",
}

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Вход в аккаунт</h1>
          <p className="text-sm text-muted-foreground">Введите свои данные для входа</p>
        </div>
        <SignInForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <a href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  )
}

