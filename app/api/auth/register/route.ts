import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { db } from "@/lib/local-db"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Проверка, существует ли пользователь с таким email
    const existingUser = db.users.findByEmail(email)

    if (existingUser) {
      return NextResponse.json({ message: "Пользователь с таким email уже существует" }, { status: 409 })
    }

    // Хеширование пароля
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Создание нового пользователя
    const user = db.users.create({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

