import type {NextApiHandler} from 'next'
import type {Message} from '../../app/apiTypes'

import messagesArray from '../../data/messages.json'

const messages: Message[] = messagesArray

export default (async (request, response) => {
  const {messageIDs} = request.body
  response.json(messages.filter(({id}) => messageIDs.includes(id)))
}) as NextApiHandler
