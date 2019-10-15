import { NotFound, BadRequest } from 'fejl'
import { pick } from 'lodash'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

// Prevent overposting.
const pickProps = data => pick(data, ['title', 'completed'])

/**
 * Todo Service.
 * Gets a todo store injected.
 */
export default class UserService {
  constructor({ User }) {
    this.user = User
  }

  async find(params) {
    return this.todoStore.find(params)
  }

  async get(id) {
    assertId(id)
    // If `todoStore.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.user
      .find()
      .byId(id)
      .then(NotFound.makeAssert(`Todo with id "${id}" not found`))
  }

  async create(data) {
    BadRequest.assert(data, 'No todo payload given')
    BadRequest.assert(data.title, 'title is required')
    BadRequest.assert(data.title.length < 100, 'title is too long')
    return this.todoStore.create(pickProps(data))
  }

  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No todo payload given')

    // Make sure the todo exists by calling `get`.
    await this.get(id)

    // Prevent overposting.
    const picked = pickProps(data)
    return this.todoStore.update(id, picked)
  }

  async remove(id) {
    // Make sure the todo exists by calling `get`.
    await this.get(id)
    return this.todoStore.remove(id)
  }
}
