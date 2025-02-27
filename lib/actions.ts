"use server"

import { db } from "@/lib/local-db"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email"
import { v4 as uuidv4 } from "uuid"
import { writeFile } from "fs/promises"
import path from "path"
import bcryptjs from "bcryptjs"

// Счетчик посещений
export async function incrementVisitorCount() {
  try {
    const counters = db.findAll("visitorCounter")
    if (counters.length > 0) {
      const counter = counters[0]
      db.update("visitorCounter", counter.id, { count: counter.count + 1 })
    } else {
      db.create("visitorCounter", { id: uuidv4(), count: 1 })
    }
  } catch (error) {
    console.error("Error incrementing visitor count:", error)
  }
}

export async function getVisitorCount() {
  try {
    const counters = db.findAll("visitorCounter")
    return counters.length > 0 ? counters[0].count : 0
  } catch (error) {
    console.error("Error getting visitor count:", error)
    return 0
  }
}

// Обращения
export async function createAppeal(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("categoryId") as string
    const userId = formData.get("userId") as string

    const appealId = uuidv4()
    const appeal = db.appeals.create({
      id: appealId,
      title,
      content,
      status: "PENDING",
      categoryId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Handle file attachments
    const attachments = []
    for (let i = 0; formData.get(`attachment${i}`); i++) {
      const file = formData.get(`attachment${i}`) as File
      const fileName = `${appealId}-${file.name}`
      const filePath = path.join(process.cwd(), "public", "uploads", fileName)

      await writeFile(filePath, Buffer.from(await file.arrayBuffer()))

      attachments.push({
        id: uuidv4(),
        appealId,
        fileName,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
      })
    }

    // Save attachments to the database
    db.appealAttachments.createMany(attachments)

    revalidatePath("/appeals/my")
    return { success: true }
  } catch (error) {
    console.error("Error creating appeal:", error)
    return { success: false, error: "Не удалось создать обращение" }
  }
}

export async function createNotification(data: {
  type: "APPEAL_STATUS_UPDATE" | "NEW_RESPONSE" | "NEWS_UPDATE"
  content: string
  userId: string
}) {
  try {
    const notification = db.notifications.create({
      id: uuidv4(),
      type: data.type,
      content: data.content,
      userId: data.userId,
      read: false,
      createdAt: new Date().toISOString(),
    })

    const user = db.users.findById(data.userId)

    if (user?.email && user.emailNotifications) {
      await sendEmail(user.email, `Новое уведомление: ${data.type}`, `<p>${data.content}</p>`)
    }

    revalidatePath("/dashboard")
    return { success: true, notification }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { success: false, error: "Не удалось создать уведомление" }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    db.notifications.update(notificationId, { read: true })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: "Не удалось отметить уведомление как прочитанное" }
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    db.notifications.delete(notificationId)

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting notification:", error)
    return { success: false, error: "Не удалось удалить уведомление" }
  }
}

// Обновим существующие действия, чтобы они создавали уведомления

export async function updateAppealStatus(appealId: string, status: string) {
  try {
    const appeal = db.appeals.findById(appealId)

    if (!appeal) {
      return { success: false, error: "Обращение не найдено" }
    }

    db.appeals.update(appealId, { status })

    const user = db.users.findById(appeal.userId)

    if (user?.appealStatusUpdates) {
      await createNotification({
        type: "APPEAL_STATUS_UPDATE",
        content: `Статус вашего обращения "${appeal.title}" изменен на "${status}"`,
        userId: appeal.userId,
      })
    }

    revalidatePath(`/appeals/${appealId}`)
    revalidatePath("/admin/appeals")
    return { success: true }
  } catch (error) {
    console.error("Error updating appeal status:", error)
    return { success: false, error: "Не удалось обновить статус обращения" }
  }
}

export async function respondToAppeal(appealId: string, response: string) {
  try {
    const appeal = db.appeals.findById(appealId)

    if (!appeal) {
      return { success: false, error: "Обращение не найдено" }
    }

    db.appealResponses.create({
      id: uuidv4(),
      content: response,
      appealId: appealId,
      createdAt: new Date().toISOString(),
    })

    db.appeals.update(appealId, { status: "ANSWERED" })

    const user = db.users.findById(appeal.userId)

    if (user?.newResponses) {
      await createNotification({
        type: "NEW_RESPONSE",
        content: `Получен новый ответ на ваше обращение "${appeal.title}"`,
        userId: appeal.userId,
      })
    }

    revalidatePath(`/appeals/${appealId}`)
    revalidatePath("/admin/appeals")
    return { success: true }
  } catch (error) {
    console.error("Error responding to appeal:", error)
    return { success: false, error: "Не удалось ответить на обращение" }
  }
}

export async function deleteAppeal(appealId: string) {
  try {
    db.appealResponses.deleteMany({ appealId })
    db.appeals.delete(appealId)

    revalidatePath("/admin/appeals")
    revalidatePath("/appeals/my")
    return { success: true }
  } catch (error) {
    console.error("Error deleting appeal:", error)
    return { success: false, error: "Не удалось удалить обращение" }
  }
}

// Пользователи
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    email?: string
    phone?: string
    address?: string
  },
) {
  try {
    db.users.update(userId, data)

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Не удалось обновить профиль" }
  }
}

export async function changeUserPassword(userId: string, currentPasswordPlain: string, newPasswordPlain: string) {
  try {
    const user = db.users.findById(userId)
    if (!user || !user.password) {
      return { success: false, error: "Пользователь не найден" }
    }

    const isPasswordValid = await bcryptjs.compare(currentPasswordPlain, user.password)

    if (!isPasswordValid) {
      return { success: false, error: "Неверный текущий пароль" }
    }

    const hashedPassword = await bcryptjs.hash(newPasswordPlain, 10)

    db.users.update(userId, { password: hashedPassword })

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error changing user password:", error)
    return { success: false, error: "Не удалось изменить пароль" }
  }
}

export async function updateUserNotificationSettings(
  userId: string,
  data: {
    emailNotifications: boolean
    appealStatusUpdates: boolean
    newResponses: boolean
    newsUpdates: boolean
  },
) {
  try {
    db.users.update(userId, data)

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating user notification settings:", error)
    return { success: false, error: "Не удалось обновить настройки уведомлений" }
  }
}

export async function deleteUser(userId: string) {
  try {
    // Удаляем все ответы на обращения пользователя
    const appeals = db.appeals.findAll().filter((appeal) => appeal.userId === userId)
    const appealIds = appeals.map((appeal) => appeal.id)
    db.appealResponses.deleteMany({ appealId: appealIds })

    // Удаляем все обращения пользователя
    db.appeals.deleteMany({ userId })

    // Удаляем пользователя
    db.users.delete(userId)

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Не удалось удалить пользователя" }
  }
}

// Новости
export async function createNews(data: {
  title: string
  content: string
  image?: string
  published: boolean
}) {
  try {
    const news = db.news.create({
      id: uuidv4(),
      title: data.title,
      content: data.content,
      image: data.image,
      published: data.published,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    if (data.published) {
      const users = db.users.findAll().filter((user) => user.newsUpdates)

      for (const user of users) {
        await createNotification({
          type: "NEWS_UPDATE",
          content: `Опубликована новая новость: "${data.title}"`,
          userId: user.id,
        })
      }
    }

    revalidatePath("/admin/news")
    return { success: true }
  } catch (error) {
    console.error("Error creating news:", error)
    return { success: false, error: "Не удалось создать новость" }
  }
}

export async function updateNews(
  newsId: string,
  data: {
    title: string
    content: string
    image?: string
    published: boolean
  },
) {
  try {
    db.news.update(newsId, data)

    revalidatePath("/admin/news")
    return { success: true }
  } catch (error) {
    console.error("Error updating news:", error)
    return { success: false, error: "Не удалось обновить новость" }
  }
}

export async function deleteNews(newsId: string) {
  try {
    db.news.delete(newsId)

    revalidatePath("/admin/news")
    return { success: true }
  } catch (error) {
    console.error("Error deleting news:", error)
    return { success: false, error: "Не удалось удалить новость" }
  }
}

export async function toggleNewsPublished(newsId: string, published: boolean) {
  try {
    db.news.update(newsId, { published })

    revalidatePath("/admin/news")
    return { success: true }
  } catch (error) {
    console.error("Error toggling news published:", error)
    return { success: false, error: "Не удалось изменить статус публикации" }
  }
}

// FAQ
export async function createFAQ(data: {
  question: string
  answer: string
  category: string
  order: number
}) {
  try {
    db.faq.create({
      id: uuidv4(),
      question: data.question,
      answer: data.answer,
      category: data.category,
      order: data.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidatePath("/admin/faq")
    revalidatePath("/faq")
    return { success: true }
  } catch (error) {
    console.error("Error creating FAQ:", error)
    return { success: false, error: "Не удалось создать вопрос FAQ" }
  }
}

export async function updateFAQ(
  id: string,
  data: {
    question: string
    answer: string
    category: string
    order: number
  },
) {
  try {
    db.faq.update(id, data)

    revalidatePath("/admin/faq")
    revalidatePath("/faq")
    return { success: true }
  } catch (error) {
    console.error("Error updating FAQ:", error)
    return { success: false, error: "Не удалось обновить вопрос FAQ" }
  }
}

export async function deleteFAQ(id: string) {
  try {
    db.faq.remove(id)

    revalidatePath("/admin/faq")
    revalidatePath("/faq")
    return { success: true }
  } catch (error) {
    console.error("Error deleting FAQ:", error)
    return { success: false, error: "Не удалось удалить вопрос FAQ" }
  }
}

