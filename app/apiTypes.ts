export type ChatID = number
export type MessageID = number
export type UserID = number

export type User = {
  id: UserID
  name: string
  icon: string
}

export type Message = {
  id: MessageID
  author: UserID
  chat: ChatID
  content: string
}

export type Chat = {
  id: ChatID
  name: string
  users: UserID[]
  messages: MessageID[]
  icon: string
}
