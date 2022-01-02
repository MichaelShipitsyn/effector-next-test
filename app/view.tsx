import Link from 'next/link'
import {useEffect, useRef} from 'react'

import type {MessageID} from './apiTypes'

export const ChatLinkView = ({
  url,
  icon,
  empty,
  unread,
  name,
}: {
  url: string
  icon: string
  empty: boolean
  unread: number
  name: string
}) => (
  <Link href={url}>
    <a data-chatlist="item">
      <span data-avatar>{icon}</span>
      <span data-chatlist-item="badge" data-empty-badge={empty}>
        {unread}
      </span>
      <span data-chatlist-item="content">{name}</span>
    </a>
  </Link>
)

export const IndexPageView = ({
  userName,
  children: chats,
}: {
  userName: string
  children: JSX.Element
}) => (
  <div data-container>
    <div data-chat="header">
      <span data-header="chatlist">Chats</span>
      <span data-header="username">
        Hello,&nbsp;<b>{userName}</b>!
      </span>
    </div>
    {chats}
  </div>
)

export const ChatMessageView = ({
  name,
  icon,
  type,
  content,
  messageID,
  onShow,
}: {
  name: string
  icon: string
  type: 'own' | 'incoming'
  content: string
  messageID: MessageID
  onShow: (messageID: number) => unknown
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onShow(messageID),
      {threshold: [0.5]},
    )
    observer.observe(ref.current!)
    return () => observer.disconnect()
  }, [messageID, onShow])
  return (
    <div data-message={type} ref={ref}>
      <span data-message-item="name">{name}</span>
      <span data-message-item="content">{content}</span>
      <span data-avatar>{icon}</span>
    </div>
  )
}

export const ChatMessagesView = ({
  chatName,
  children: messages,
}: {
  chatName: string
  children: JSX.Element | JSX.Element[]
}) => (
  <div data-container>
    <div data-chat="header">
      <Link href='/'>
        <a data-header="backButton">back</a>
      </Link>
      <span data-header="chatname">{chatName}</span>
    </div>
    {messages}
  </div>
)
