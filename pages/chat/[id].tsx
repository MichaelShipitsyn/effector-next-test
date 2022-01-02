import {fork, serialize, allSettled} from 'effector'
import {useStore, useEvent, useList} from 'effector-react'
import {queryAllChatsFx, queryChatContentFx} from '../../app/query'
import {
  $chats,
  $currentUser,
  $currentChat,
  $currentChatName,
  $currentChatMessages,
} from '../../app/state'
import {readMessage} from '../../app/unreadCount'
import {ChatMessageView, ChatMessagesView} from '../../app/view'

export default function ChatMessages() {
  const chatName = useStore($currentChatName)
  const readMessageFn = useEvent(readMessage)
  return (
    <ChatMessagesView chatName={chatName}>
      {useList($currentChatMessages, {
        getKey: ({id}) => id,
        fn: ({id, icon, name, type, content}) => (
          <ChatMessageView
            messageID={id}
            name={name}
            icon={icon}
            type={type}
            content={content}
            onShow={readMessageFn}
          />
        ),
      })}
    </ChatMessagesView>
  )
}

export async function getStaticPaths() {
  const scope = fork()
  await allSettled(queryAllChatsFx, {scope})
  const chats = scope.getState($chats)
  const paths = chats.map(({id}) => ({params: {id: `${id}`}}))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({params}: {params: {id: string}}) {
  const chatID = +params.id
  const scope = fork({
    values: [
      [$currentUser, 1],
      [$currentChat, chatID],
    ],
  })
  await allSettled(queryChatContentFx, {scope, params: chatID})
  return {
    props: {
      // chatID,
      initialState: serialize(scope),
    },
  }
}
