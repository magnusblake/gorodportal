"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Bell, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { markNotificationAsRead, deleteNotification } from "@/lib/actions"

type Notification = {
  id: string
  type: "APPEAL_STATUS_UPDATE" | "NEW_RESPONSE" | "NEWS_UPDATE"
  content: string
  read: boolean
  createdAt: string
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      setNotifications(data)
    }
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id)
    if (result.success) {
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNotification(id)
    if (result.success) {
      setNotifications(notifications.filter((n) => n.id !== id))
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "APPEAL_STATUS_UPDATE":
        return <Bell className="h-4 w-4 text-blue-500" />
      case "NEW_RESPONSE":
        return <Bell className="h-4 w-4 text-green-500" />
      case "NEWS_UPDATE":
        return <Bell className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-muted-foreground">У вас нет уведомлений</p>
      ) : (
        notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getNotificationIcon(notification.type)}
                <span className="ml-2">{notification.type.replace(/_/g, " ")}</span>
              </CardTitle>
              <CardDescription>
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ru })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{notification.content}</p>
              <div className="flex justify-end space-x-2 mt-2">
                {!notification.read && (
                  <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Прочитано
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleDelete(notification.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

