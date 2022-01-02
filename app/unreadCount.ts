import {createEvent, createStore, combine} from 'effector'
import type {MessageID} from './apiTypes'
import {$chats} from './state'

export const readMessage = createEvent<MessageID>()

const $read = createStore<MessageID[]>([])

$read.on(readMessage, (read, msgID) => {
  if (read.includes(msgID)) return
  return [...read, msgID]
})

export const $unreadCount = combine($chats, $read, (chats, read) =>
  chats.map(({id: chatID, messages}) => ({
    chatID,
    count: messages.filter((id) => !read.includes(id)).length,
  })),
)
