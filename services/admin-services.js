const { User } = require('../models')
const { getUser } = require('../helpers/auth-helper')

const adminServices = {
  getUsers: async (req, callback) => {
    try {
      const users = await User.findAll({ raw: true })

      return callback(null, { users })
    } catch (err) {
      return callback(err)
    }
  },
  putUser: async (req, callback) => {
    try {
      const id = Number(req.params.id)
      const currentUser = getUser(req)
      const { updatedAt } = req.body

      const user = await User.findByPk(id)

      if (!user) throw new Error("User doesn't exist!")
      if (user.email === 'root@example.com') throw new Error('Root permission changes are not allowed!')
      if (user.id === currentUser.id) throw new Error('Self-permission changes are not allowed!')
      if (user.updatedAt.toISOString() !== updatedAt) throw new Error('Data has been updated by another user. Please reload and try again!')

      const updatedUser = await user.update({ isAdmin: !user.isAdmin })

      return callback(null, { updatedUser })
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = adminServices
