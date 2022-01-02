import type {NextApiHandler} from 'next'
import type {User} from '../../app/apiTypes'

import usersArray from '../../data/users.json'

const users: User[] = usersArray

export default (async (request, response) => {
  const {userIDs} = request.body
  response.json(users.filter(({id}) => userIDs.includes(id)))
}) as NextApiHandler
