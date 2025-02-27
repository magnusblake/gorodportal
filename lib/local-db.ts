import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data")

type Entity = "users" | "appeals" | "news" | "faq" | "categories" | "notifications"

function ensureDbExists() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true })
  }
}

function getFilePath(entity: Entity): string {
  return path.join(DB_PATH, `${entity}.json`)
}

function readData<T>(entity: Entity): T[] {
  ensureDbExists()
  const filePath = getFilePath(entity)
  if (!fs.existsSync(filePath)) {
    return []
  }
  const data = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(data)
}

function writeData<T>(entity: Entity, data: T[]): void {
  ensureDbExists()
  const filePath = getFilePath(entity)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export function findAll<T>(entity: Entity): T[] {
  return readData<T>(entity)
}

export function findById<T extends { id: string }>(entity: Entity, id: string): T | undefined {
  const data = readData<T>(entity)
  return data.find((item) => item.id === id)
}

export function create<T extends { id: string }>(entity: Entity, item: T): T {
  const data = readData<T>(entity)
  data.push(item)
  writeData(entity, data)
  return item
}

export function update<T extends { id: string }>(entity: Entity, id: string, updates: Partial<T>): T | undefined {
  const data = readData<T>(entity)
  const index = data.findIndex((item) => item.id === id)
  if (index === -1) return undefined
  data[index] = { ...data[index], ...updates }
  writeData(entity, data)
  return data[index]
}

export function remove<T extends { id: string }>(entity: Entity, id: string): boolean {
  const data = readData<T>(entity)
  const filteredData = data.filter((item) => item.id !== id)
  if (filteredData.length === data.length) return false
  writeData(entity, filteredData)
  return true
}

export const db = {
  users: {
    findAll: () => findAll<any>("users"),
    findById: (id: string) => findById<any>("users", id),
    create: (user: any) => create("users", user),
    update: (id: string, updates: any) => update("users", id, updates),
    remove: (id: string) => remove("users", id),
    findByEmail: (email: string) => findAll<any>("users").find((user) => user.email === email),
  },
  appeals: {
    findAll: () => findAll<any>("appeals"),
    findById: (id: string) => findById<any>("appeals", id),
    create: (appeal: any) => create("appeals", appeal),
    update: (id: string, updates: any) => update("appeals", id, updates),
    remove: (id: string) => remove("appeals", id),
  },
  news: {
    findAll: () => findAll<any>("news"),
    findById: (id: string) => findById<any>("news", id),
    create: (news: any) => create("news", news),
    update: (id: string, updates: any) => update("news", id, updates),
    remove: (id: string) => remove("news", id),
  },
  faq: {
    findAll: () => findAll<any>("faq"),
    findById: (id: string) => findById<any>("faq", id),
    create: (faq: any) => create("faq", faq),
    update: (id: string, updates: any) => update("faq", id, updates),
    remove: (id: string) => remove("faq", id),
  },
  categories: {
    findAll: () => findAll<any>("categories"),
    findById: (id: string) => findById<any>("categories", id),
    create: (category: any) => create("categories", category),
    update: (id: string, updates: any) => update("categories", id, updates),
    remove: (id: string) => remove("categories", id),
  },
  notifications: {
    findAll: () => findAll<any>("notifications"),
    findById: (id: string) => findById<any>("notifications", id),
    create: (notification: any) => create("notifications", notification),
    update: (id: string, updates: any) => update("notifications", id, updates),
    remove: (id: string) => remove("notifications", id),
  },
}

