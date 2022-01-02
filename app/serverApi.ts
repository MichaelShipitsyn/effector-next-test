import {createEffect} from 'effector'
import type {Chat, Message, User, ChatID, MessageID, UserID} from './apiTypes'

async function request<Result>(url: string, params: any = {}): Promise<Result> {
  console.log('request', url, params)
  const response = await fetch(`https://kv4wr.sse.codesandbox.io${url}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(params),
  })
  if (!response.ok) throw Error(response.statusText)
  return await response.json()
}

export const fetchAllChatsFx = createEffect(() => {
  return request<ChatID[]>('/api/getChats')
})

export const fetchChatsFx = createEffect((chatIDs: ChatID[]) => {
  if (chatIDs.length === 0) return [] as Chat[]
  return request<Chat[]>('/api/chat', {chatIDs})
})

export const fetchMessagesFx = createEffect((msgIDs: MessageID[]) => {
  if (msgIDs.length === 0) return [] as Message[]
  return request<Message[]>('/api/message', {messageIDs: msgIDs})
})

export const fetchUsersFx = createEffect((userIDs: UserID[]) => {
  if (userIDs.length === 0) return [] as User[]
  return request<User[]>('/api/user', {userIDs})
})
