const { User } = require('../models')
const bcrypt = require('bcryptjs')

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
  }
}

module.exports = userServices
