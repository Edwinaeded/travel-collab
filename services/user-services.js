const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { getUser } = require('../helpers/auth-helper')
const { localFileHandler } = require('../helpers/file-helpers')

const userServices = {
  postSignUp: (req, callback) => {
    const { name, email, password, confirmPassword } = req.body
    if (!name || !email || !password || !confirmPassword) throw new Error('Please complete all required fields')
    if (password !== confirmPassword) throw new Error('Passwords do not match!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        User.create({
          name,
          email,
          password: hash
        })
      })
      .then(newUser => callback(null, { newUser }))
      .catch(err => callback(err))
  },
  getUser: (req, callback) => {
    const currentUser = getUser(req)
    const id = Number(req.params.id)
    if (id !== currentUser.id) throw new Error('Permission denied!')

    User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User does't exist!")
        return callback(null, { user })
      })
      .catch(err => callback(err))
  },
  editUser: (req, callback) => {
    const currentUser = getUser(req)
    const id = Number(req.params.id)
    if (id !== currentUser.id) throw new Error('Permission denied!')

    User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User does't exist!")
        return callback(null, { user })
      })
      .catch(err => callback(err))
  },
  putUser: (req, callback) => {
    const { name } = req.body
    const { file } = req
    const currentUser = getUser(req)
    const id = Number(req.params.id)
    if (id !== currentUser.id) throw new Error('Permission denied!')

    Promise.all([
      User.findByPk(id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User does't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(updatedUser => callback(null, { user: updatedUser.toJSON() }))
      .catch(err => callback(err))
  }
}

module.exports = userServices
