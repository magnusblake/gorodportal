import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data")

type Entity = "users" | "appeals" | "news" | "faq" | "categories" | "notifications" | "visitorCounter"

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

export const db = {
  findAll: <T>(entity: Entity): T[] => readData<T>(entity),
  findById: <T extends { id: string }>(entity: Entity, id: string): T | undefined => {
    const data = readData<T>(entity)
    return data.find((item) => item.id === id)
  },
  create: <T extends { id: string }>(entity: Entity, item: T): T => {
    const data = readData<T>(entity)
    data.push(item)
    writeData(entity, data)
    return item
  },
  update: <T extends { id: string }>(entity: Entity, id: string, updates: Partial<T>): T | undefined => {
    const data = readData<T>(entity)
    const index = data.findIndex((item) => item.id === id)
    if (index === -1) return undefined
    data[index] = { ...data[index], ...updates }
    writeData(entity, data)
    return data[index]
  },
  remove: <T extends { id: string }>(entity: Entity, id: string): boolean => {
    const data = readData<T>(entity)
    const filteredData = data.filter((item) => item.id !== id)
    if (filteredData.length === data.length) return false
    writeData(entity, filteredData)
    return true
  },
  users: {
    findByEmail: (email: string) => {
      const users = readData<any>("users");
      return users.find((user) => user.email === email);
    },
  },
  visitorCounter: {
    increment: () => {
      const counters = readData<any>("visitorCounter")
      if (counters.length > 0) {
        const counter = counters[0]
        const count = counter.count;
        return db.update("visitorCounter", counter.id, { count: count + 1 })
      } else {
        return db.create("visitorCounter", { id: "1", count: 1 })
      }
    },
    getCount: () => {
      const counters = readData<any>("visitorCounter")
      return counters.length > 0 ? counters[0].count : 0
    },
  },
}

