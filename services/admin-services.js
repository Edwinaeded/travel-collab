const { User } = require('../models')

const adminServices = {
  getUsers: (req, callback) => {
    User.findAll({ raw: true })
      .then(users => callback(null, { users }))
      .catch(err => callback(err))
  }
}

module.exports = adminServices
