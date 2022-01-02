import {fork, serialize, allSettled} from 'effector'
import {useStore, useList, useStoreMap} from 'effector-react'
import {queryAllChatsFx, queryCurrentUserFx} from '../app/query'
import {$chats, $currentUser, $currentUserName} from '../app/state'
import {$unreadCount} from '../app/unreadCount'

import {ChatLinkView, IndexPageView} from '../app/view'

export default function Index() {
  const userName = useStore($currentUserName)
  return (
    <IndexPageView userName={userName}>
      {useList($chats, {
        getKey: ({id}) => id,
        fn: ({name, id, icon, messages}) => {
          const unread = useStoreMap({
            store: $unreadCount,
            keys: [id, messages],
            fn(items) {
              const item = items.find((item) => item.chatID === id)
              if (!item) return messages.length
              return item.count
            },
          })
          return (
            <ChatLinkView
              url={`/chat/${id}`}
              icon={icon}
              empty={unread === 0}
              unread={unread}
              name={name}
            />
          )
        },
      })}
    </IndexPageView>
  )
}

export async function getStaticProps({}) {
  const scope = fork({values: [[$currentUser, 1]]})
  await allSettled(queryAllChatsFx, {scope})
  await allSettled(queryCurrentUserFx, {scope})
  return {
    props: {
      initialState: serialize(scope),
    },
  }
}
