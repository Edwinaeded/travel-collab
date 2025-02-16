const { User } = require('../models')
const { getUser } = require('../helpers/auth-helper')

const adminServices = {
  getUsers: (req, callback) => {
    User.findAll({ raw: true })
      .then(users => callback(null, { users }))
      .catch(err => callback(err))
  },
  putUser: (req, callback) => {
    const id = Number(req.params.id)
    const currentUser = getUser(req)

    User.findByPk(id)
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        if (user.email === 'root@example.com') throw new Error('Root permission changes are not allowed!')
        if (user.id === currentUser.id) throw new Error('Self-permission changes are not allowed!')

        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(updatedUser => callback(null, { updatedUser }))
      .catch(err => callback(err))
  }
}

module.exports = adminServices
