import type {NextApiHandler} from 'next'
import type {Chat} from '../../app/apiTypes'

import chatsArray from '../../data/chats.json'

const chats: Chat[] = chatsArray

export default (async (_, response) => {
  response.json(chats.map(({id}) => id))
}) as NextApiHandler
