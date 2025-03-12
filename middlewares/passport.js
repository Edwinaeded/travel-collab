const { User } = require('../models')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return done(null, false, req.flash('error_msg', 'Incorrect account or password!'))

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return done(null, false, req.flash('error_msg', 'Incorrect account or password!'))

    return done(null, user)
  } catch (err) {
    return done(err)
  }
}))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)

    return done(null, user ? user.toJSON() : null)
  } catch (err) {
    return done(err)
  }
})

module.exports = passport
