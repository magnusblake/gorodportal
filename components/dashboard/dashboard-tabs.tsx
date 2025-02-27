"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/components/dashboard/user-profile"
import { UserAppealsStats } from "@/components/dashboard/user-appeals-stats"
import { UserNotificationSettings } from "@/components/dashboard/user-notification-settings"
import { NotificationsList } from "@/components/notifications/notifications-list"

interface DashboardTabsProps {
  userId: string
}

export function DashboardTabs({ userId }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">Профиль</TabsTrigger>
        <TabsTrigger value="stats">Статистика обращений</TabsTrigger>
        <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        <TabsTrigger value="settings">Настройки уведомлений</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UserProfile userId={userId} />
      </TabsContent>
      <TabsContent value="stats">
        <UserAppealsStats userId={userId} />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationsList />
      </TabsContent>
      <TabsContent value="settings">
        <UserNotificationSettings userId={userId} />
      </TabsContent>
    </Tabs>
  )
}

