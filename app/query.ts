import {createEffect, attach} from 'effector'
import type {Chat, ChatID, UserID} from './apiTypes'
import {
  fetchAllChatsFx,
  fetchChatsFx,
  fetchMessagesFx,
  fetchUsersFx,
} from './serverApi'
import {$chats, $currentUser, $messages, $users} from './state'

export const queryAllChatsFx = createEffect(async () => {
  const chatIDs = await fetchAllChatsFx()
  const chatsInfo = await fetchChatsFx(chatIDs)
  return chatsInfo
})

const getChatFx = attach({
  source: $chats,
  async effect(chats, chatID: ChatID) {
    let chat = getByID(chatID, chats)
    if (!chat) [chat] = await fetchChatsFx([chatID])
    return chat
  },
})

const getChatMessagesFx = attach({
  source: $messages,
  async effect(messages, chat: Chat) {
    const ids = chat.messages
    const missedIDs = getMissedIDs(ids, messages)
    const updates = await fetchMessagesFx(missedIDs)
    return joinUpdateWithCache(ids, missedIDs, updates, messages)
  },
})

const getUsersFx = attach({
  source: $users,
  async effect(users, ids: UserID[]) {
    const missedIDs = getMissedIDs(ids, users)
    const newUsers = await fetchUsersFx(missedIDs)
    return joinUpdateWithCache(ids, missedIDs, newUsers, users)
  },
})

export const queryCurrentUserFx = attach({
  source: $currentUser,
  async effect(userID) {
    if (userID === null) throw Error('no current user')
    return await getUsersFx([userID])
  },
})

export const queryChatContentFx = createEffect(async (chatID: ChatID) => {
  const chat = await getChatFx(chatID)
  const messages = await getChatMessagesFx(chat)
  const userIDs = uniq(messages.map((msg) => msg.author))
  const users = await getUsersFx(userIDs)
  return {users, messages}
})

function joinUpdateWithCache<T extends {id: number}>(
  ids: number[],
  missedIDs: number[],
  update: T[],
  cache: T[],
) {
  return ids.map((id) => {
    const targetList = missedIDs.includes(id) ? update : cache
    return getByID(id, targetList)!
  })
}

function getMissedIDs<T extends {id: number}>(ids: number[], cache: T[]) {
  return ids.filter((id) => !getByID(id, cache))
}

function getByID<T extends {id: number}>(id: number, list: T[]) {
  return list.find((item) => item.id === id)
}

function uniq<T>(list: T[]): T[] {
  return [...new Set(list)]
}
