const { getUser } = require('../helpers/auth-helper')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  return res.redirect('/signin')
}

const adminAuthenticated = (req, res, next) => {
  const user = getUser(req)
  if (req.isAuthenticated() && user.isAdmin) return next()
  if (req.isAuthenticated() && !user.isAdmin) throw new Error('Permission denied!')
  return res.redirect('/signin')
}

module.exports = { authenticated, adminAuthenticated }
