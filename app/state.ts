import {createStore, combine} from 'effector'
import type {Chat, Message, User, UserID, ChatID} from './apiTypes'
import {fetchChatsFx, fetchMessagesFx, fetchUsersFx} from './serverApi'

export const $chats = createStore<Chat[]>([])
export const $messages = createStore<Message[]>([])
export const $users = createStore<User[]>([])
export const $currentUser = createStore<UserID | null>(null)
export const $currentChat = createStore<ChatID | null>(null)

$chats.on(fetchChatsFx.doneData, (chats, info) => {
  return [...chats, ...info]
})

$messages.on(fetchMessagesFx.doneData, (msgs, data) => {
  return [...msgs, ...data]
})

$users.on(fetchUsersFx.doneData, (users, data) => {
  return [...users, ...data]
})

export const $currentUserName = combine(
  $users,
  $currentUser,
  (users, userID) => {
    if (userID === null) return 'guest'
    const user = users.find((user) => user.id === userID)
    if (!user) return 'guest'
    return user.name
  },
)

export const $currentChatMessages = combine(
  $currentChat,
  $currentUser,
  $chats,
  $messages,
  $users,
  (chatID, currentUserID, chats, messages, users) => {
    if (chatID === null) return []
    const chat = chats.find((chat) => chat.id === chatID)!
    const chatMessages = messages.filter((msg) =>
      chat.messages.includes(msg.id),
    )
    return chatMessages.map((msg) => {
      const isOwn = msg.author === currentUserID
      const user = users.find((user) => user.id === msg.author)
      const messageType: 'own' | 'incoming' = isOwn ? 'own' : 'incoming'
      const icon = user?.icon || ''
      const name = user?.name || ''
      return {
        id: msg.id,
        name,
        icon,
        type: messageType,
        content: msg.content,
      }
    })
  },
)

export const $currentChatName = combine(
  $currentChat,
  $chats,
  (chatID, chats) => {
    if (chatID === null) return ''
    const chat = chats.find((chat) => chat.id === chatID)!
    return chat.name
  },
)
