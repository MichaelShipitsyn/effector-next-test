import type {NextApiHandler} from 'next'
import type {Chat} from '../../app/apiTypes'

import chatsArray from '../../data/chats.json'

const chats: Chat[] = chatsArray

export default (async (request, response) => {
  const {chatIDs} = request.body
  console.log('chat', request.body)
  response.json(chats.filter(({id}) => chatIDs.includes(id)))
}) as NextApiHandler
