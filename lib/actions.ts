"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email"

// Счетчик посещений
export async function incrementVisitorCount() {
  try {
    const counter = await db.visitorCounter.findFirst()

    if (counter) {
      await db.visitorCounter.update({
        where: { id: counter.id },
        data: { count: counter.count + 1 },
      })
    } else {
      await db.visitorCounter.create({
        data: { count: 1 },
      })
    }
  } catch (error) {
    console.error("Error incrementing visitor count:", error)
  }
}

export async function getVisitorCount() {
  try {
    const counter = await db.visitorCounter.findFirst()
    return counter?.count || 0
  } catch (error) {
    console.error("Error getting visitor count:", error)
    return 0
  }
}

// Обращения
export async function createAppeal(data: {
  title: string
  content: string
  categoryId: string
  userId: string
}) {
  try {
    await db.appeal.create({
      data: {
        title: data.title,
        content: data.content,
        status: "PENDING",
        category: { connect: { id: data.categoryId } },
        user: { connect: { id: data.userId } },
      },
    })

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
    const notification = await db.notification.create({
      data: {
        type: data.type,
        content: data.content,
        userId: data.userId,
      },
    })

    const user = await db.user.findUnique({
      where: { id: data.userId },
      select: { email: true, emailNotifications: true },
    })

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
    await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: "Не удалось отметить уведомление как прочитанное" }
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await db.notification.delete({
      where: { id: notificationId },
    })

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
    const appeal = await db.appeal.update({
      where: { id: appealId },
      data: { status },
      include: { user: true },
    })

    if (appeal.user.appealStatusUpdates) {
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
    const appeal = await db.appeal.findUnique({
      where: { id: appealId },
      include: { user: true },
    })

    if (!appeal) {
      return { success: false, error: "Обращение не найдено" }
    }

    await db.appealResponse.create({
      data: {
        content: response,
        appeal: { connect: { id: appealId } },
      },
    })

    await db.appeal.update({
      where: { id: appealId },
      data: { status: "ANSWERED" },
    })

    if (appeal.user.newResponses) {
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
    await db.appealResponse.deleteMany({
      where: { appealId },
    })

    await db.appeal.delete({
      where: { id: appealId },
    })

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
    await db.user.update({
      where: { id: userId },
      data,
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Не удалось обновить профиль" }
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
    await db.user.update({
      where: { id: userId },
      data,
    })

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
    await db.appealResponse.deleteMany({
      where: {
        appeal: {
          userId,
        },
      },
    })

    // Удаляем все обращения пользователя
    await db.appeal.deleteMany({
      where: { userId },
    })

    // Удаляем пользователя
    await db.user.delete({
      where: { id: userId },
    })

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
    const news = await db.news.create({
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
        published: data.published,
      },
    })

    if (data.published) {
      const users = await db.user.findMany({
        where: { newsUpdates: true },
      })

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
    await db.news.update({
      where: { id: newsId },
      data,
    })

    revalidatePath("/admin/news")
    return { success: true }
  } catch (error) {
    console.error("Error updating news:", error)
    return { success: false, error: "Не удалось обновить новость" }
  }
}

export async function deleteNews(newsId: string) {
  try {
    await db.news.delete({
      where: { id: newsId },
    })

    revalidatePath("/admin/news")
    return { success: true }
  } catch (error) {
    console.error("Error deleting news:", error)
    return { success: false, error: "Не удалось удалить новость" }
  }
}

export async function toggleNewsPublished(newsId: string, published: boolean) {
  try {
    await db.news.update({
      where: { id: newsId },
      data: { published },
    })

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
    await db.fAQ.create({
      data,
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
    await db.fAQ.update({
      where: { id },
      data,
    })

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
    await db.fAQ.delete({
      where: { id },
    })

    revalidatePath("/admin/faq")
    revalidatePath("/faq")
    return { success: true }
  } catch (error) {
    console.error("Error deleting FAQ:", error)
    return { success: false, error: "Не удалось удалить вопрос FAQ" }
  }
}

