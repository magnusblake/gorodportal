import { NextResponse } from "next/server"
import { hash } from "bcrypt"

import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Проверка, существует ли пользователь с таким email
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "Пользователь с таким email уже существует" }, { status: 409 })
    }

    // Хеширование пароля
    const hashedPassword = await hash(password, 10)

    // Создание нового пользователя
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Возвращаем успешный ответ без пароля
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: "Пользователь успешно зарегистрирован", user: userWithoutPassword },
      { status: 201 },
    )
  } catch (error) {
    console.error("Ошибка регистрации:", error)
    return NextResponse.json({ message: "Ошибка при регистрации пользователя" }, { status: 500 })
  }
}

